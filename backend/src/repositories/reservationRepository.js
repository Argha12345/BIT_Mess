import { readCollectionAsync, insertRecordAsync, updateRecordAsync } from './dbDriver.js';

export const reservationRepository = {
  findAll: async () => {
    return await readCollectionAsync('reservations');
  },

  findByStudent: async (rollNo) => {
    const reservations = await readCollectionAsync('reservations');
    const studentRes = reservations.filter(r => r.rollNo.toLowerCase() === rollNo.toLowerCase());
    return [...studentRes].sort((a, b) => {
      const dateDiff = new Date(b.date) - new Date(a.date);
      if (dateDiff !== 0) return dateDiff;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  },

  findFiltered: async ({ date, meal, section, status }) => {
    const reservations = await readCollectionAsync('reservations');
    let filtered = reservations;

    if (date) filtered = filtered.filter(r => r.date === date);
    if (meal) filtered = filtered.filter(r => r.meal === meal);
    if (section) filtered = filtered.filter(r => r.section.toLowerCase() === section.toLowerCase());
    if (status) filtered = filtered.filter(r => r.status === status);

    return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  },

  create: async (reservationData) => {
    return await insertRecordAsync('reservations', reservationData);
  },

  updateStatus: async (id, status) => {
    return await updateRecordAsync('reservations', id, { status });
  }
};
