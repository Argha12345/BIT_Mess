import { wasteRepository } from '../repositories/wasteRepository.js';
import { notificationRepository } from '../repositories/notificationRepository.js';
import { BUSINESS_CONFIG } from '../config/constants.js';

// Official Mess Dining Timings:
// - Morning Breakfast: 07:00 AM – 08:30 AM (420 - 510 min)
// - Afternoon Lunch:   12:15 PM – 01:45 PM (735 - 825 min)
// - Evening Snacks:    04:00 PM – 05:30 PM (960 - 1050 min)
// - Night Dinner:      07:00 PM – 09:00 PM (1140 - 1260 min)
function calculateMealPeriodAndOccupancy(hour, minute) {
  const currentMinutes = hour * 60 + minute;

  let isDiningActive = false;
  let currentMeal = null;
  let currentSlot = null;
  let occupancyPercentage = 0;
  let nextMeal = null;
  let nextMealTime = null;

  if (currentMinutes >= 420 && currentMinutes <= 510) {
    // 07:00 AM - 08:30 AM
    isDiningActive = true;
    currentMeal = 'Breakfast';
    currentSlot = currentMinutes < 465 ? '07:00 AM - 07:45 AM' : '07:45 AM - 08:30 AM';
    occupancyPercentage = currentMinutes < 465 ? 45 : 75;
  } else if (currentMinutes >= 735 && currentMinutes <= 825) {
    // 12:15 PM - 01:45 PM
    isDiningActive = true;
    currentMeal = 'Lunch';
    currentSlot = currentMinutes < 780 ? '12:15 PM - 01:00 PM' : '01:00 PM - 01:45 PM';
    occupancyPercentage = currentMinutes < 780 ? 80 : 55;
  } else if (currentMinutes >= 960 && currentMinutes <= 1050) {
    // 04:00 PM - 05:30 PM
    isDiningActive = true;
    currentMeal = 'Snacks';
    currentSlot = currentMinutes < 1005 ? '04:00 PM - 04:45 PM' : '04:45 PM - 05:30 PM';
    occupancyPercentage = currentMinutes < 1005 ? 60 : 35;
  } else if (currentMinutes >= 1140 && currentMinutes <= 1260) {
    // 07:00 PM - 09:00 PM
    isDiningActive = true;
    currentMeal = 'Dinner';
    currentSlot = currentMinutes < 1200 ? '07:00 PM - 08:00 PM' : '08:00 PM - 09:00 PM';
    occupancyPercentage = currentMinutes < 1200 ? 85 : 45;
  } else {
    isDiningActive = false;
    if (currentMinutes < 420) {
      nextMeal = 'Breakfast';
      nextMealTime = '07:00 AM';
    } else if (currentMinutes < 735) {
      nextMeal = 'Lunch';
      nextMealTime = '12:15 PM';
    } else if (currentMinutes < 960) {
      nextMeal = 'Snacks';
      nextMealTime = '04:00 PM';
    } else if (currentMinutes < 1140) {
      nextMeal = 'Dinner';
      nextMealTime = '07:00 PM';
    } else {
      nextMeal = 'Breakfast (Tomorrow)';
      nextMealTime = '07:00 AM';
    }
  }

  return { isDiningActive, currentMeal, currentSlot, occupancyPercentage, nextMeal, nextMealTime };
}

// SRP Helper: Calculate wait time and congestion status
function calculateQueueWaitStatus(occupancyPercentage, isDiningActive) {
  if (!isDiningActive) {
    return { averageWaitTimeMinutes: 0, queueStatus: 'Closed' };
  }
  const averageWaitTimeMinutes = Math.max(1, Math.round(1 + (occupancyPercentage * 0.12)));
  let queueStatus = 'Smooth';
  if (averageWaitTimeMinutes > 9) queueStatus = 'Congested';
  else if (averageWaitTimeMinutes > 5) queueStatus = 'Moderate';

  return { averageWaitTimeMinutes, queueStatus };
}

export const analyticsService = {
  getLiveStatus: async (section = 'Boys') => {
    const now = new Date();
    const { isDiningActive, currentMeal, currentSlot, occupancyPercentage, nextMeal, nextMealTime } = calculateMealPeriodAndOccupancy(now.getHours(), now.getMinutes());
    const { averageWaitTimeMinutes, queueStatus } = calculateQueueWaitStatus(occupancyPercentage, isDiningActive);

    const announcements = await notificationRepository.getNotifications(section);

    return {
      isDiningActive,
      currentMeal: currentMeal || nextMeal,
      currentSlot: currentSlot || 'Service Closed',
      nextMeal,
      nextMealTime,
      totalCheckedInThisMeal: isDiningActive ? Math.round(occupancyPercentage * 7.5) : 0,
      occupancyPercentage: isDiningActive ? occupancyPercentage : 0,
      averageWaitTimeMinutes,
      queueStatus,
      servingCountersOpen: isDiningActive ? 1 : 0,
      announcements
    };
  },

  getWasteAnalytics: async (section = 'Boys') => {
    const waste = await wasteRepository.getLogs(section);

    let totalPreConsumer = 0;
    let totalPostConsumer = 0;
    let totalReusable = 0;
    let totalNonReusable = 0;
    let totalDonatedKg = 0;
    let totalDonatedMeals = 0;
    let totalRepurposedKg = 0;
    let totalMealsCooked = 0;
    let totalActualDiners = 0;

    waste.forEach(w => {
      totalPreConsumer += (w.preConsumerWaste || 0);
      totalPostConsumer += (w.postConsumerWaste || 0);
      totalMealsCooked += (w.cookedMeals || 0);
      totalActualDiners += (w.actualDiners || 0);

      // Reusable vs Non-Reusable calculation fallback logic
      const logTotal = (w.preConsumerWaste || 0) + (w.postConsumerWaste || 0);
      const reusable = typeof w.reusableWaste === 'number' ? w.reusableWaste : Math.round(w.preConsumerWaste * 0.7);
      const nonReusable = typeof w.nonReusableWaste === 'number' ? w.nonReusableWaste : (logTotal - reusable);
      
      totalReusable += reusable;
      totalNonReusable += nonReusable;

      if (w.dispositionStatus === 'Donated to NGO') {
        totalDonatedKg += reusable;
        totalDonatedMeals += (w.donatedMeals || Math.round(reusable / BUSINESS_CONFIG.AVERAGE_KG_PER_MEAL));
      } else if (w.dispositionStatus === 'Repurposed for Dinner' || w.dispositionStatus === 'Repurposed for Breakfast') {
        totalRepurposedKg += reusable;
      }
    });

    const totalWaste = totalPreConsumer + totalPostConsumer;
    const estimatedFinancialLossRs = totalWaste * BUSINESS_CONFIG.COST_PER_KG_WASTE_RS;
    const totalMealsWasted = Math.round(totalWaste / BUSINESS_CONFIG.AVERAGE_KG_PER_MEAL);
    const co2SavedKg = Math.round((totalDonatedKg + totalRepurposedKg) * 2.5); // 2.5 kg CO2e saved per kg food diverted from landfill

    const uniqueDates = [...new Set(waste.map(w => w.date))].sort();

    const dailyTrends = uniqueDates.map(date => {
      const dayRecords = waste.filter(w => w.date === date);
      const pre = dayRecords.reduce((sum, r) => sum + (r.preConsumerWaste || 0), 0);
      const post = dayRecords.reduce((sum, r) => sum + (r.postConsumerWaste || 0), 0);
      const reusable = dayRecords.reduce((sum, r) => sum + (typeof r.reusableWaste === 'number' ? r.reusableWaste : Math.round((r.preConsumerWaste || 0) * 0.7)), 0);
      const nonReusable = dayRecords.reduce((sum, r) => sum + (typeof r.nonReusableWaste === 'number' ? r.nonReusableWaste : ((r.preConsumerWaste || 0) + (r.postConsumerWaste || 0) - Math.round((r.preConsumerWaste || 0) * 0.7))), 0);

      return {
        date: date.substring(5),
        preConsumer: pre,
        postConsumer: post,
        reusable,
        nonReusable,
        total: pre + post
      };
    });

    const meals = ['Breakfast', 'Lunch', 'Dinner'];
    const mealWasteData = meals.map(meal => {
      const mealRecords = waste.filter(w => w.meal === meal);
      const pre = mealRecords.reduce((sum, r) => sum + (r.preConsumerWaste || 0), 0);
      const post = mealRecords.reduce((sum, r) => sum + (r.postConsumerWaste || 0), 0);
      const reusable = mealRecords.reduce((sum, r) => sum + (typeof r.reusableWaste === 'number' ? r.reusableWaste : Math.round((r.preConsumerWaste || 0) * 0.7)), 0);
      const nonReusable = mealRecords.reduce((sum, r) => sum + (typeof r.nonReusableWaste === 'number' ? r.nonReusableWaste : ((r.preConsumerWaste || 0) + (r.postConsumerWaste || 0) - Math.round((r.preConsumerWaste || 0) * 0.7))), 0);

      return {
        name: meal,
        preConsumer: pre,
        postConsumer: post,
        reusable,
        nonReusable,
        total: pre + post
      };
    });

    const menuGroups = {};
    waste.forEach(w => {
      if (!menuGroups[w.menuItem]) {
        menuGroups[w.menuItem] = { name: w.menuItem, count: 0, totalWaste: 0 };
      }
      menuGroups[w.menuItem].count++;
      menuGroups[w.menuItem].totalWaste += ((w.preConsumerWaste || 0) + (w.postConsumerWaste || 0));
    });

    const topWasteItems = Object.values(menuGroups)
      .map(g => ({
        name: g.name,
        avgWaste: Math.round(g.totalWaste / g.count)
      }))
      .sort((a, b) => b.avgWaste - a.avgWaste)
      .slice(0, 5);

    return {
      metrics: {
        totalWasteKg: totalWaste,
        preConsumerKg: totalPreConsumer,
        postConsumerKg: totalPostConsumer,
        reusableWasteKg: totalReusable,
        nonReusableWasteKg: totalNonReusable,
        donatedKg: totalDonatedKg,
        donatedMeals: totalDonatedMeals,
        repurposedKg: totalRepurposedKg,
        co2SavedKg,
        totalMealsCooked,
        totalActualDiners,
        averageWastePerDinerGrams: Math.round((totalWaste / (totalActualDiners || 1)) * 1000),
        estimatedFinancialLossRs,
        totalMealsWasted
      },
      dailyTrends,
      mealWasteData,
      topWasteItems
    };
  },


  getQueuePredictions: async (section = 'Boys') => {
    return {
      Breakfast: [
        { slot: '07:00 AM - 07:45 AM', avgOccupancy: 190, waitTimeMin: 3, label: 'Fast & Smooth' },
        { slot: '07:45 AM - 08:30 AM', avgOccupancy: 360, waitTimeMin: 8, label: 'Peak Rush Window' }
      ],
      Lunch: [
        { slot: '12:15 PM - 01:00 PM', avgOccupancy: 410, waitTimeMin: 10, label: 'Peak Lunch Window' },
        { slot: '01:00 PM - 01:45 PM', avgOccupancy: 240, waitTimeMin: 5, label: 'Moderate Traffic' }
      ],
      Snacks: [
        { slot: '04:00 PM - 04:45 PM', avgOccupancy: 280, waitTimeMin: 6, label: 'Moderately Busy' },
        { slot: '04:45 PM - 05:30 PM', avgOccupancy: 150, waitTimeMin: 2, label: 'Quiet Flow' }
      ],
      Dinner: [
        { slot: '07:00 PM - 08:00 PM', avgOccupancy: 390, waitTimeMin: 11, label: 'Peak Dinner Window' },
        { slot: '08:00 PM - 09:00 PM', avgOccupancy: 210, waitTimeMin: 4, label: 'Moderate Flow' }
      ]
    };
  }
};

