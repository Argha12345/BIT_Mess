import { readCollectionAsync, insertRecordAsync, deleteRecordAsync } from './dbDriver.js';

export const wasteRepository = {
  getLogs: async (section) => {
    const waste = await readCollectionAsync('waste');
    let filtered = waste;
    if (section) {
      filtered = waste.filter(w => w.section === section);
    }
    return [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  addLog: async (logData) => {
    return await insertRecordAsync('waste', logData);
  },

  addFeedback: async (feedbackData) => {
    return await insertRecordAsync('feedback', feedbackData);
  },

  getFeedbacks: async (section) => {
    const feedback = await readCollectionAsync('feedback');
    if (section) {
      return feedback.filter(f => f.section === section);
    }
    return feedback;
  },

  deleteFeedback: async (id) => {
    return await deleteRecordAsync('feedback', id);
  }
};
