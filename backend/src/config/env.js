import dotenv from 'dotenv';
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const jwtSecret = process.env.JWT_SECRET;
if (isProduction && !jwtSecret) {
  throw new Error('JWT_SECRET must be configured in production.');
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  JWT_SECRET: jwtSecret || 'bit_mess_secret_jwt_key_2026_super_secure',
  MONGODB_URI: process.env.MONGODB_URI || '',
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || 'bit_mess',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN
    ? process.env.CLIENT_ORIGIN.split(',').map(origin => origin.trim()).filter(Boolean)
    : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173']
};

export default env;
