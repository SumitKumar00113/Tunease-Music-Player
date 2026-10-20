import dotenv from "dotenv";

dotenv.config();

export interface IAuthConfig {
  MONGO_URI?: string;
  JWT_REFRESH_TOKEN_SECRET_KEY?: string;
  JWT_ACCESS_TOKEN_SECRET_KEY?: string;
  JWT_REFRESH_SECRET?: string;
  JWT_ACCESS_SECRET?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  GOOGLE_CALLBACK_URL: string;
  JWT_SECRET?: string;
  CLIENT_URL: string;
  NODE_ENV: string;
  RABBIT_MQ_URL?: string;
  REDIS_URL?: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASSWORD?: string | null;
  OTP_SECRET?: string;
}

const _config: IAuthConfig = {
  MONGO_URI: process.env.MONGO_URI,
  JWT_REFRESH_TOKEN_SECRET_KEY: process.env.JWT_REFRESH_TOKEN_SECRET_KEY || process.env.JWT_REFRESH_SECRET,
  JWT_ACCESS_TOKEN_SECRET_KEY: process.env.JWT_ACCESS_TOKEN_SECRET_KEY || process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || "https://tunease-auth-service-latest.onrender.com/api/auth/google/callback",
  JWT_SECRET: process.env.JWT_SECRET,
  CLIENT_URL: process.env.CLIENT_URL || "https://tunease-auth-service-latest.onrender.com",
  NODE_ENV: process.env.NODE_ENV || "development",
  RABBIT_MQ_URL: process.env.RABBIT_MQ_URL,
  REDIS_URL: process.env.REDIS_URL,
  REDIS_HOST: process.env.REDIS_HOST || "127.0.0.1",
  REDIS_PORT: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || null,
  OTP_SECRET: process.env.OTP_SECRET,
};

export default _config;
module.exports = _config;
