import { menuService } from '../services/menuService.js';

export const getMenu = async (req, res, next) => {
  try {
    const { section } = req.query;
    const menu = await menuService.getMenu(section);
    res.json(menu);
  } catch (error) {
    next(error);
  }
};

export const updateMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await menuService.updateMenuItem(id, req.body);
    res.json({
      message: 'Menu item updated successfully',
      menuItem: updated
    });
  } catch (error) {
    next(error);
  }
};
