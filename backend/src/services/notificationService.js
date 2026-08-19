import { notificationRepository } from '../repositories/notificationRepository.js';

export const notificationService = {
  getNotifications: async (section) => {
    return await notificationRepository.getNotifications(section);
  },

  sendNotification: async ({ section = 'All', studentRollNo = 'All', message }) => {
    if (!message || message.trim() === '') {
      const err = new Error('Notification message content is required');
      err.status = 400;
      throw err;
    }

    return await notificationRepository.addNotification({
      section,
      studentRollNo,
      message: message.trim()
    });
  },

  deleteNotification: async (id) => {
    const deleted = await notificationRepository.deleteNotification(id);
    if (!deleted) {
      const err = new Error('Notification record not found');
      err.status = 404;
      throw err;
    }
    return { message: 'Notification deleted successfully' };
  }
};
