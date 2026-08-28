import { wasteRepository } from '../repositories/wasteRepository.js';
import { notificationRepository } from '../repositories/notificationRepository.js';
import { BUSINESS_CONFIG } from '../config/constants.js';

// SRP Helper: Calculate meal period, active slot, and occupancy percentage by hour/minute
function calculateMealPeriodAndOccupancy(hour, minute) {
  let currentMeal = 'Lunch';
  let activeSlots = ['12:00 PM - 12:30 PM', '12:30 PM - 01:00 PM', '01:00 PM - 01:30 PM', '01:30 PM - 02:00 PM'];
  let currentSlot = activeSlots[1];
  let occupancyPercentage = 45;

  if (hour >= 7 && hour < 9) {
    currentMeal = 'Breakfast';
    activeSlots = ['07:00 AM - 07:30 AM', '07:30 AM - 08:00 AM', '08:00 AM - 08:30 AM', '08:30 AM - 09:00 AM'];
    currentSlot = hour === 7 ? (minute < 30 ? activeSlots[0] : activeSlots[1]) : (minute < 30 ? activeSlots[2] : activeSlots[3]);
    occupancyPercentage = hour === 7 ? (minute < 30 ? 25 : 65) : (minute < 30 ? 80 : 35);
  } else if (hour >= 12 && hour < 14) {
    currentMeal = 'Lunch';
    activeSlots = ['12:00 PM - 12:30 PM', '12:30 PM - 01:00 PM', '01:00 PM - 01:30 PM', '01:30 PM - 02:00 PM'];
    currentSlot = hour === 12 ? (minute < 30 ? activeSlots[0] : activeSlots[1]) : (minute < 30 ? activeSlots[2] : activeSlots[3]);
    occupancyPercentage = hour === 12 ? (minute < 30 ? 30 : 75) : (minute < 30 ? 90 : 40);
  } else if (hour >= 16 && hour < 18) {
    currentMeal = 'Snacks';
    activeSlots = ['04:30 PM - 05:00 PM', '05:00 PM - 05:30 PM'];
    currentSlot = (hour === 16 && minute >= 30) ? activeSlots[0] : activeSlots[1];
    occupancyPercentage = (hour === 16 && minute >= 30) ? 55 : 30;
  } else if (hour >= 19 && hour < 21) {
    currentMeal = 'Dinner';
    activeSlots = ['07:00 PM - 07:30 PM', '07:30 AM - 08:00 PM', '08:00 PM - 08:30 PM', '08:30 PM - 09:00 PM'];
    currentSlot = hour === 19 ? (minute < 30 ? activeSlots[0] : activeSlots[1]) : (minute < 30 ? activeSlots[2] : activeSlots[3]);
    occupancyPercentage = hour === 19 ? (minute < 30 ? 35 : 70) : (minute < 30 ? 85 : 45);
  }

  return { currentMeal, currentSlot, occupancyPercentage };
}

// SRP Helper: Calculate wait time and congestion status
function calculateQueueWaitStatus(occupancyPercentage) {
  const averageWaitTimeMinutes = Math.max(1, Math.round(1 + (occupancyPercentage * 0.12)));
  let queueStatus = 'Smooth';
  if (averageWaitTimeMinutes > 9) queueStatus = 'Congested';
  else if (averageWaitTimeMinutes > 5) queueStatus = 'Moderate';

  return { averageWaitTimeMinutes, queueStatus };
}

export const analyticsService = {
  getLiveStatus: async (section = 'Boys') => {
    const now = new Date();
    const { currentMeal, currentSlot, occupancyPercentage } = calculateMealPeriodAndOccupancy(now.getHours(), now.getMinutes());
    const { averageWaitTimeMinutes, queueStatus } = calculateQueueWaitStatus(occupancyPercentage);

    const announcements = await notificationRepository.getNotifications(section);

    return {
      currentMeal,
      currentSlot,
      totalCheckedInThisMeal: Math.round(occupancyPercentage * 7.5),
      occupancyPercentage,
      averageWaitTimeMinutes,
      queueStatus,
      servingCountersOpen: 3,
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
        { slot: '07:00 AM - 07:30 AM', avgOccupancy: 120, waitTimeMin: 2, label: 'Fast & Quiet' },
        { slot: '07:30 AM - 08:00 AM', avgOccupancy: 280, waitTimeMin: 6, label: 'Moderately Busy' },
        { slot: '08:00 AM - 08:30 AM', avgOccupancy: 340, waitTimeMin: 9, label: 'Peak Hour' },
        { slot: '08:30 AM - 09:00 AM', avgOccupancy: 150, waitTimeMin: 3, label: 'Moderate' }
      ],
      Lunch: [
        { slot: '12:00 PM - 12:30 PM', avgOccupancy: 180, waitTimeMin: 3, label: 'Fast' },
        { slot: '12:30 PM - 01:00 PM', avgOccupancy: 360, waitTimeMin: 8, label: 'Crowded' },
        { slot: '01:00 PM - 01:30 PM', avgOccupancy: 410, waitTimeMin: 11, label: 'Peak Hour' },
        { slot: '01:30 PM - 02:00 PM', avgOccupancy: 200, waitTimeMin: 4, label: 'Moderate' }
      ],
      Snacks: [
        { slot: '04:30 PM - 05:00 PM', avgOccupancy: 290, waitTimeMin: 6, label: 'Moderately Busy' },
        { slot: '05:00 PM - 05:30 PM', avgOccupancy: 140, waitTimeMin: 2, label: 'Quiet' }
      ],
      Dinner: [
        { slot: '07:00 PM - 07:30 PM', avgOccupancy: 150, waitTimeMin: 3, label: 'Quiet' },
        { slot: '07:30 PM - 08:00 PM', avgOccupancy: 320, waitTimeMin: 7, label: 'Crowded' },
        { slot: '08:00 PM - 08:30 PM', avgOccupancy: 380, waitTimeMin: 10, label: 'Peak Hour' },
        { slot: '08:30 PM - 09:00 PM', avgOccupancy: 190, waitTimeMin: 4, label: 'Moderate' }
      ]
    };
  }
};

