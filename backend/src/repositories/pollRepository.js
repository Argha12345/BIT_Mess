import { readCollectionAsync, insertRecordAsync, updateRecordAsync, deleteRecordAsync, saveCollectionAsync } from './dbDriver.js';

export const pollRepository = {
  findAll: async () => {
    return await readCollectionAsync('polls');
  },

  findBySection: async (section) => {
    const polls = await readCollectionAsync('polls');
    let filtered = [...polls].sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate));
    if (section) {
      filtered = filtered.filter(p => p.section === section);
    }
    return filtered;
  },

  findById: async (id) => {
    const polls = await readCollectionAsync('polls');
    return polls.find(p => p.id === id);
  },

  create: async (pollData) => {
    return await insertRecordAsync('polls', pollData);
  },

  update: async (id, updates) => {
    return await updateRecordAsync('polls', id, updates);
  },

  delete: async (id) => {
    return await deleteRecordAsync('polls', id);
  },

  saveAll: async (pollsData) => {
    return await saveCollectionAsync('polls', pollsData);
  }
};
