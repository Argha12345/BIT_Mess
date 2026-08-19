import { analyticsService } from '../services/analyticsService.js';

export const getLiveStatus = async (req, res, next) => {
  try {
    const { section = 'Boys' } = req.query;
    const status = await analyticsService.getLiveStatus(section);
    res.json(status);
  } catch (error) {
    next(error);
  }
};

export const getWasteAnalytics = async (req, res, next) => {
  try {
    const { section = 'Boys' } = req.query;
    const analytics = await analyticsService.getWasteAnalytics(section);
    res.json(analytics);
  } catch (error) {
    next(error);
  }
};

export const getQueuePredictions = async (req, res, next) => {
  try {
    const { section = 'Boys' } = req.query;
    const predictions = await analyticsService.getQueuePredictions(section);
    res.json(predictions);
  } catch (error) {
    next(error);
  }
};
