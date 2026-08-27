import dotenv from 'dotenv';
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const defaultJwtSecret = 'bit_mess_secret_jwt_key_2026_super_secure';
const jwtSecret = process.env.JWT_SECRET || defaultJwtSecret;

if (isProduction && (!process.env.JWT_SECRET || process.env.JWT_SECRET === defaultJwtSecret)) {
  console.warn('SECURITY WARNING: Running in production without a custom JWT_SECRET configured in environment variables.');
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  JWT_SECRET: jwtSecret,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN
    ? process.env.CLIENT_ORIGIN.split(',')
    : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173']
};

export default env;
