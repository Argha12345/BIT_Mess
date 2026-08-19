import { readCollectionAsync, updateRecordAsync, saveCollectionAsync } from './dbDriver.js';

let sectionCache = null;

async function ensureMenuCache() {
  const menu = await readCollectionAsync('menu');
  sectionCache = new Map();
  menu.forEach(item => {
    if (!sectionCache.has(item.section)) {
      sectionCache.set(item.section, []);
    }
    sectionCache.get(item.section).push(item);
  });
}

export const menuRepository = {
  findAll: async () => {
    return await readCollectionAsync('menu');
  },

  findBySection: async (section) => {
    if (!section) return await readCollectionAsync('menu');
    if (!sectionCache) await ensureMenuCache();

    const cached = sectionCache.get(section);
    if (cached) return cached;

    await ensureMenuCache();
    return sectionCache.get(section) || [];
  },

  findById: async (id) => {
    const menu = await readCollectionAsync('menu');
    return menu.find(item => item.id === id);
  },

  updateItem: async (id, updates) => {
    const updated = await updateRecordAsync('menu', id, updates);
    await ensureMenuCache();
    return updated;
  },

  saveAll: async (menuData) => {
    const saved = await saveCollectionAsync('menu', menuData);
    await ensureMenuCache();
    return saved;
  }
};
