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
    let totalMealsCooked = 0;
    let totalActualDiners = 0;

    waste.forEach(w => {
      totalPreConsumer += w.preConsumerWaste;
      totalPostConsumer += w.postConsumerWaste;
      totalMealsCooked += w.cookedMeals;
      totalActualDiners += w.actualDiners;
    });

    const totalWaste = totalPreConsumer + totalPostConsumer;
    const estimatedFinancialLossRs = totalWaste * BUSINESS_CONFIG.COST_PER_KG_WASTE_RS;
    const totalMealsWasted = Math.round(totalWaste / BUSINESS_CONFIG.AVERAGE_KG_PER_MEAL);

    const uniqueDates = [...new Set(waste.map(w => w.date))].sort();

    const dailyTrends = uniqueDates.map(date => {
      const dayRecords = waste.filter(w => w.date === date);
      const pre = dayRecords.reduce((sum, r) => sum + r.preConsumerWaste, 0);
      const post = dayRecords.reduce((sum, r) => sum + r.postConsumerWaste, 0);

      return {
        date: date.substring(5),
        preConsumer: pre,
        postConsumer: post,
        total: pre + post
      };
    });

    const meals = ['Breakfast', 'Lunch', 'Dinner'];
    const mealWasteData = meals.map(meal => {
      const mealRecords = waste.filter(w => w.meal === meal);
      const pre = mealRecords.reduce((sum, r) => sum + r.preConsumerWaste, 0);
      const post = mealRecords.reduce((sum, r) => sum + r.postConsumerWaste, 0);

      return {
        name: meal,
        preConsumer: pre,
        postConsumer: post,
        total: pre + post
      };
    });

    const menuGroups = {};
    waste.forEach(w => {
      if (!menuGroups[w.menuItem]) {
        menuGroups[w.menuItem] = { name: w.menuItem, count: 0, totalWaste: 0 };
      }
      menuGroups[w.menuItem].count++;
      menuGroups[w.menuItem].totalWaste += (w.preConsumerWaste + w.postConsumerWaste);
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
