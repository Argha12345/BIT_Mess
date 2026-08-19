import { userRepository } from '../repositories/userRepository.js';
import bcrypt from 'bcryptjs';

export const userService = {
  getAllUsers: async () => {
    const users = await userRepository.findAll();
    return users.map(({ password: _, ...u }) => u);
  },

  createUser: async ({ rollNo, name, password, hostel, section, messType = 'Standard', role = 'student' }) => {
    if (!rollNo || !name || !hostel || !section) {
      const err = new Error('Email address, student name, hostel, and section are required');
      err.status = 400;
      throw err;
    }

    const lower = rollNo.toLowerCase().trim();
    if (role === 'student' && !lower.endsWith('@bitsathy.ac.in')) {
      const err = new Error('Student email address must end with @bitsathy.ac.in');
      err.status = 400;
      throw err;
    }

    const existing = await userRepository.findByRollNo(lower);
    if (existing) {
      const err = new Error('Account with this Email address already exists');
      err.status = 409;
      throw err;
    }

    const initialPassword = password || 'studentpassword';
    const hashedPassword = bcrypt.hashSync(initialPassword, 10);

    const newUser = await userRepository.create({
      rollNo: lower,
      name,
      password: hashedPassword,
      role,
      hostel,
      section,
      messType
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  updateUser: async (id, { rollNo, name, hostel, section }) => {
    const user = await userRepository.findById(id);
    if (!user) {
      const err = new Error('User account not found');
      err.status = 404;
      throw err;
    }

    const updates = {};
    if (name) updates.name = name;
    if (hostel) updates.hostel = hostel;
    if (section) updates.section = section;

    if (rollNo) {
      const lower = rollNo.toLowerCase().trim();
      if (user.role === 'student' && !lower.endsWith('@bitsathy.ac.in')) {
        const err = new Error('Student email address must end with @bitsathy.ac.in');
        err.status = 400;
        throw err;
      }
      const existing = await userRepository.findByRollNo(lower);
      if (existing && existing.id !== id) {
        const err = new Error('Email address is already in use by another account');
        err.status = 409;
        throw err;
      }
      updates.rollNo = lower;
    }

    const users = await userRepository.findAll();
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      await userRepository.saveAll(users);
      const { password: _, ...updatedWithoutPassword } = users[index];
      return updatedWithoutPassword;
    }

    const err = new Error('Failed to update account');
    err.status = 500;
    throw err;
  },

  deleteUser: async (id) => {
    const user = await userRepository.findById(id);
    if (!user) {
      const err = new Error('User account not found');
      err.status = 404;
      throw err;
    }

    if (user.role === 'admin' || user.rollNo === 'admin1') {
      const err = new Error('Main Administrator account cannot be deleted');
      err.status = 403;
      throw err;
    }

    await userRepository.delete(id);
    return { message: 'User account deleted successfully' };
  }
};
