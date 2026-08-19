import { readCollectionAsync, insertRecordAsync, deleteRecordAsync } from './dbDriver.js';

export const notificationRepository = {
  getNotifications: async (section) => {
    const notifications = await readCollectionAsync('notifications');
    let filtered = notifications;
    if (section && section !== 'All') {
      filtered = notifications.filter(n => n.section === section || n.section === 'All');
    }
    return [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  addNotification: async (notifData) => {
    return await insertRecordAsync('notifications', {
      createdAt: new Date().toISOString(),
      ...notifData
    });
  },

  deleteNotification: async (id) => {
    return await deleteRecordAsync('notifications', id);
  }
};
