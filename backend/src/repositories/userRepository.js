import { readCollectionAsync, saveCollectionAsync, insertRecordAsync, deleteRecordAsync } from './dbDriver.js';

// In-memory Map indexes for O(1) query lookups
let rollNoMap = null;
let idMap = null;

async function ensureIndexes() {
  const users = await readCollectionAsync('users');
  rollNoMap = new Map();
  idMap = new Map();
  users.forEach(u => {
    rollNoMap.set(u.rollNo.toLowerCase(), u);
    idMap.set(u.id, u);
  });
}

export const userRepository = {
  findAll: async () => {
    return await readCollectionAsync('users');
  },

  findByRollNo: async (rollNo) => {
    if (!rollNoMap) await ensureIndexes();
    const cached = rollNoMap.get(rollNo.toLowerCase());
    if (cached) return cached;

    // Fallback refresh on cache miss
    await ensureIndexes();
    return rollNoMap.get(rollNo.toLowerCase());
  },

  findById: async (id) => {
    if (!idMap) await ensureIndexes();
    const cached = idMap.get(id);
    if (cached) return cached;

    await ensureIndexes();
    return idMap.get(id);
  },

  create: async (userData) => {
    const newRecord = await insertRecordAsync('users', userData);
    await ensureIndexes(); // Refresh indexes asynchronously
    return newRecord;
  },

  delete: async (id) => {
    const deleted = await deleteRecordAsync('users', id);
    await ensureIndexes();
    return deleted;
  },

  saveAll: async (users) => {
    const saved = await saveCollectionAsync('users', users);
    await ensureIndexes();
    return saved;
  }
};
