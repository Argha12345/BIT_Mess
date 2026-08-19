import { userService } from '../services/userService.js';

export const userController = {
  getAllUsers: async (req, res, next) => {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (err) {
      next(err);
    }
  },

  createUser: async (req, res, next) => {
    try {
      const newUser = await userService.createUser(req.body);
      res.status(201).json({ message: 'Account created successfully', user: newUser });
    } catch (err) {
      next(err);
    }
  },

  updateUser: async (req, res, next) => {
    try {
      const updated = await userService.updateUser(req.params.id, req.body);
      res.json({ message: 'Student account updated successfully', user: updated });
    } catch (err) {
      next(err);
    }
  },

  deleteUser: async (req, res, next) => {
    try {
      const result = await userService.deleteUser(req.params.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
};
