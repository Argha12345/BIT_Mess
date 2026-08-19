import { wasteRepository } from '../repositories/wasteRepository.js';
import { menuRepository } from '../repositories/menuRepository.js';

export const wasteService = {
  getWasteLogs: async (section) => {
    return await wasteRepository.getLogs(section);
  },

  logDailyWaste: async ({ section, date, meal, menuItem, cookedMeals, actualDiners, preConsumerWaste, postConsumerWaste }) => {
    if (!section || !date || !meal || !menuItem || cookedMeals === undefined || actualDiners === undefined || preConsumerWaste === undefined || postConsumerWaste === undefined) {
      const err = new Error('All waste logging fields (including section) are required');
      err.status = 400;
      throw err;
    }

    return await wasteRepository.addLog({
      section,
      date,
      meal,
      menuItem,
      cookedMeals: Number(cookedMeals),
      actualDiners: Number(actualDiners),
      preConsumerWaste: Number(preConsumerWaste),
      postConsumerWaste: Number(postConsumerWaste)
    });
  },

  submitFeedback: async ({ userId, rollNo, name, section, mealId, date, rating, comment }) => {
    if (!userId || !rollNo || !name || !section || !mealId || !date || !rating) {
      const err = new Error('Missing required feedback ratings fields');
      err.status = 400;
      throw err;
    }

    return await wasteRepository.addFeedback({
      userId,
      rollNo,
      name,
      section,
      mealId,
      date,
      rating: Number(rating),
      comment: comment || ''
    });
  },

  getFeedbacks: async (section) => {
    return await wasteRepository.getFeedbacks(section);
  },

  deleteFeedback: async (id) => {
    const deleted = await wasteRepository.deleteFeedback(id);
    if (!deleted) {
      const err = new Error('Feedback record not found');
      err.status = 404;
      throw err;
    }
    return { message: 'Review deleted successfully' };
  },

  getPortionRecommendation: async ({ date, meal, section = 'Boys' }) => {
    if (!date || !meal) {
      const err = new Error('Date and meal are required query parameters');
      err.status = 400;
      throw err;
    }

    const TOTAL_HOSTEL_STUDENTS = 750;
    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getDay();
    let absentCount = 35;
    if (dayOfWeek === 0) absentCount = 95;
    else if (dayOfWeek === 6) absentCount = 60;

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[dayOfWeek];

    const menu = await menuRepository.findBySection(section);
    const menuItem = menu.find(item => item.day === dayName && item.meal === meal);
    const popularity = menuItem ? menuItem.popularity : 7;
    const menuName = menuItem ? menuItem.items : 'Standard Meal';

    const feedbacks = await wasteRepository.getFeedbacks(section);
    const mealFeedbacks = feedbacks.filter(f => f.mealId === (menuItem ? menuItem.id : ''));
    const avgRating = mealFeedbacks.length > 0
      ? mealFeedbacks.reduce((sum, f) => sum + f.rating, 0) / mealFeedbacks.length
      : 4.0;

    const baseDiners = TOTAL_HOSTEL_STUDENTS - absentCount;
    const popularityFactor = 0.6 + (popularity / 10) * 0.4;
    const ratingFactor = avgRating < 3.0 ? 0.88 : (avgRating < 4.0 ? 0.95 : 1.0);
    const BUFFER_FACTOR = 1.03;

    const predictedDiners = Math.round(baseDiners * popularityFactor * ratingFactor);
    const recommendedMeals = Math.round(predictedDiners * BUFFER_FACTOR);

    const standardMealsCooked = TOTAL_HOSTEL_STUDENTS;
    const avoidedMeals = Math.max(0, standardMealsCooked - recommendedMeals);
    const estimatedWasteSavedKg = Math.round(avoidedMeals * 0.3);
    const estimatedCostSavedRs = Math.round(avoidedMeals * 35);

    return {
      date,
      meal,
      section,
      menuItem: menuName,
      popularity,
      averageRating: parseFloat(avgRating.toFixed(1)),
      totalRegistered: TOTAL_HOSTEL_STUDENTS,
      absentCount,
      baseDiners,
      popularityAdjustment: Math.round((1 - popularityFactor) * 100),
      ratingAdjustment: Math.round((1 - ratingFactor) * 100),
      predictedDiners,
      recommendedPortions: recommendedMeals,
      savings: {
        mealsAvoided: avoidedMeals,
        wasteSavedKg: estimatedWasteSavedKg,
        costSavedRs: estimatedCostSavedRs
      }
    };
  }
};
