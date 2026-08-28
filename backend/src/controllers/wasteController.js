import { wasteService } from '../services/wasteService.js';

export const getWasteLogs = async (req, res, next) => {
  try {
    const { section } = req.query;
    const logs = await wasteService.getWasteLogs(section);
    res.json(logs);
  } catch (error) {
    next(error);
  }
};

export const logDailyWaste = async (req, res, next) => {
  try {
    const log = await wasteService.logDailyWaste(req.body);
    res.status(201).json({
      message: 'Daily waste logged successfully',
      log
    });
  } catch (error) {
    next(error);
  }
};

export const donateExcessFood = async (req, res, next) => {
  try {
    const result = await wasteService.donateExcessFood(req.body);
    res.status(201).json({
      message: 'Excess food successfully registered for NGO donation!',
      log: result
    });
  } catch (error) {
    next(error);
  }
};

export const repurposeExcessFood = async (req, res, next) => {
  try {
    const result = await wasteService.repurposeExcessFood(req.body);
    res.status(201).json({
      message: 'Excess food successfully scheduled for meal repurposing!',
      log: result
    });
  } catch (error) {
    next(error);
  }
};


export const submitFeedback = async (req, res, next) => {
  try {
    const feedback = await wasteService.submitFeedback(req.body);
    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback
    });
  } catch (error) {
    next(error);
  }
};

export const getFeedbacks = async (req, res, next) => {
  try {
    const { section } = req.query;
    const feedbacks = await wasteService.getFeedbacks(section);
    res.json(feedbacks);
  } catch (error) {
    next(error);
  }
};

export const deleteFeedback = async (req, res, next) => {
  try {
    const result = await wasteService.deleteFeedback(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getPortionRecommendation = async (req, res, next) => {
  try {
    const recommendation = await wasteService.getPortionRecommendation(req.query);
    res.json(recommendation);
  } catch (error) {
    next(error);
  }
};
