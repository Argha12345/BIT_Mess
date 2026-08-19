import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { userRepository } from '../repositories/userRepository.js';

const getJwtSecret = () => process.env.JWT_SECRET || 'bit_mess_optimization_secure_jwt_secret_key_2026_super_secret';
const getJwtExpiresIn = () => process.env.JWT_EXPIRES_IN || '7d';

const isBitsathyEmail = (emailOrRoll) => {
  if (!emailOrRoll) return false;
  const lower = emailOrRoll.toLowerCase().trim();
  return lower === 'admin1' || lower.endsWith('@bitsathy.ac.in');
};

export const authService = {
  login: async ({ rollNo, password }) => {
    if (!rollNo || !password) {
      const err = new Error('Email Address/Admin ID and Password are required');
      err.status = 400;
      throw err;
    }

    if (!isBitsathyEmail(rollNo)) {
      const err = new Error('Access Denied. Only BIT Sathy email addresses ending in @bitsathy.ac.in are authorized.');
      err.status = 403;
      throw err;
    }

    const user = await userRepository.findByRollNo(rollNo);
    if (!user) {
      const err = new Error('Invalid Email Address or Password');
      err.status = 401;
      throw err;
    }

    const isMatch = user.password.startsWith('$2a$') || user.password.startsWith('$2b$')
      ? bcrypt.compareSync(password, user.password)
      : user.password === password;

    if (!isMatch) {
      const err = new Error('Invalid Email Address or Password');
      err.status = 401;
      throw err;
    }

    const { password: _, ...userWithoutPassword } = user;

    const token = jwt.sign(
      {
        id: user.id,
        rollNo: user.rollNo,
        name: user.name,
        role: user.role,
        section: user.section,
        hostel: user.hostel,
        messType: user.messType
      },
      getJwtSecret(),
      { expiresIn: getJwtExpiresIn() }
    );

    return {
      message: 'Login successful',
      token,
      user: userWithoutPassword
    };
  },

  googleLogin: async ({ idToken }) => {
    if (!idToken) {
      const err = new Error('Google ID Token is required');
      err.status = 400;
      throw err;
    }

    let email = '';
    let name = '';
    const googleClientId = process.env.GOOGLE_CLIENT_ID;

    if (googleClientId && !idToken.startsWith('mock_')) {
      try {
        const client = new OAuth2Client(googleClientId);
        const ticket = await client.verifyIdToken({
          idToken,
          audience: googleClientId
        });
        const payload = ticket.getPayload();
        email = payload.email ? payload.email.toLowerCase().trim() : '';
        name = payload.name || 'BIT Student';
      } catch (e) {
        const err = new Error('Invalid or expired Google Token');
        err.status = 401;
        throw err;
      }
    } else {
      // Fallback / Dev mode support
      email = idToken.includes('@') ? idToken.toLowerCase().trim() : 'student@bitsathy.ac.in';
      name = 'BIT Student (Google)';
    }

    if (!email.endsWith('@bitsathy.ac.in')) {
      const err = new Error('Access Denied. Only official BIT Sathy email addresses ending in @bitsathy.ac.in are authorized.');
      err.status = 403;
      throw err;
    }

    let user = await userRepository.findByRollNo(email);
    if (!user) {
      // Auto-provision student account for authorized @bitsathy.ac.in user
      const hashedPassword = bcrypt.hashSync('studentpassword', 10);
      user = await userRepository.create({
        rollNo: email,
        name: name,
        password: hashedPassword,
        role: 'student',
        hostel: 'Sapphire',
        section: 'Boys',
        messType: 'Standard'
      });
    }

    const { password: _, ...userWithoutPassword } = user;

    const token = jwt.sign(
      {
        id: user.id,
        rollNo: user.rollNo,
        name: user.name,
        role: user.role,
        section: user.section,
        hostel: user.hostel,
        messType: user.messType
      },
      getJwtSecret(),
      { expiresIn: getJwtExpiresIn() }
    );

    return {
      message: 'Google Sign-In successful',
      token,
      user: userWithoutPassword
    };
  },

  register: async () => {
    const err = new Error('Public self-registration is disabled. Student accounts are created exclusively by the Mess Administrator.');
    err.status = 403;
    throw err;
  },

  changePassword: async ({ userId, currentPassword, newPassword }) => {
    if (!userId || !currentPassword || !newPassword) {
      const err = new Error('Current password and new password are required');
      err.status = 400;
      throw err;
    }

    if (newPassword.length < 6) {
      const err = new Error('New password must be at least 6 characters long');
      err.status = 400;
      throw err;
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      const err = new Error('User account not found');
      err.status = 404;
      throw err;
    }

    const isMatch = user.password.startsWith('$2a$') || user.password.startsWith('$2b$')
      ? bcrypt.compareSync(currentPassword, user.password)
      : user.password === currentPassword;

    if (!isMatch) {
      const err = new Error('Current password is incorrect');
      err.status = 400;
      throw err;
    }

    const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
    const users = await userRepository.findAll();
    const targetUser = users.find(u => u.id === userId);
    if (targetUser) {
      targetUser.password = hashedNewPassword;
      await userRepository.saveAll(users);
    }

    return { message: 'Password updated successfully' };
  }
};
