import { notificationService } from '../services/notificationService.js';

export const getNotifications = async (req, res, next) => {
  try {
    const { section } = req.query;
    const notifications = await notificationService.getNotifications(section);
    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

export const sendNotification = async (req, res, next) => {
  try {
    const notification = await notificationService.sendNotification(req.body);
    res.status(201).json({
      message: 'Notification broadcasted to students successfully',
      notification
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNotification = async (req, res, next) => {
  try {
    const result = await notificationService.deleteNotification(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
