import { menuRepository } from '../repositories/menuRepository.js';

export const menuService = {
  getMenu: async (section) => {
    return await menuRepository.findBySection(section);
  },

  updateMenuItem: async (id, { items, popularity }) => {
    if (!items) {
      const err = new Error('Menu items description is required');
      err.status = 400;
      throw err;
    }

    const updates = { items };
    if (popularity !== undefined) {
      updates.popularity = Number(popularity);
    }

    const updated = await menuRepository.updateItem(id, updates);
    if (!updated) {
      const err = new Error('Menu item not found');
      err.status = 404;
      throw err;
    }

    return updated;
  }
};
