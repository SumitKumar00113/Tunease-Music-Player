import client from "./client.redis";
import _config from "../config/config";

export interface CacheExpiration {
  EMAIL_DEDUPLICATION: number;
  RATE_LIMIT_COOLDOWN: number;
}

const EXPIRATION: CacheExpiration = {
  EMAIL_DEDUPLICATION: 24 * 60 * 60, // 24 hours (86400s)
  RATE_LIMIT_COOLDOWN: 60,           // 1 minute (60s)
};

export const CacheService = {
  client,
  EXPIRATION,

  async set(key: string, value: unknown, expireInSeconds?: number): Promise<string | null> {
    try {
      const data = typeof value === "string" ? value : JSON.stringify(value);
      if (expireInSeconds && Number(expireInSeconds) > 0) {
        return await client.set(key, data, "EX", Math.floor(expireInSeconds));
      }
      return await client.set(key, data);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[Notification-Redis] Cache SET failed for key "${key}":`, message);
      return null;
    }
  },

  async get<T = unknown>(key: string): Promise<T | null> {
    if (_config.NODE_ENV === "test") {
      return null;
    }
    try {
      const data = await client.get(key);
      if (!data) return null;
      try {
        return JSON.parse(data) as T;
      } catch {
        return data as unknown as T;
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[Notification-Redis] Cache GET failed for key "${key}":`, message);
      return null;
    }
  },

  async del(key: string): Promise<number | null> {
    try {
      return await client.del(key);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[Notification-Redis] Cache DEL failed for key "${key}":`, message);
      return null;
    }
  },
};

export default CacheService;
module.exports = CacheService;
