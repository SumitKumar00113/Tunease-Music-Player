import client from "./client.redis";
import { Redis } from "ioredis";

// Expiry constants in seconds
export const EXPIRATION = {
  USER_SESSION: 24 * 60 * 60, // 24 hours
  USER_PROFILE: 60 * 60, // 1 hour (3600s)
  BLACKLIST_TOKEN: 24 * 60 * 60, // 24 hours
} as const;

export interface ICacheService {
  client: Redis;
  EXPIRATION: typeof EXPIRATION;
  set(key: string, value: unknown, expireInSeconds?: number): Promise<string | null>;
  get<T = unknown>(key: string): Promise<T | string | null>;
  del(key: string): Promise<number | null>;
  delPattern(pattern: string): Promise<boolean>;
}

const CacheService: ICacheService = {
  client,
  EXPIRATION,

  /**
   * Store key with expiration in seconds
   */
  async set(key: string, value: unknown, expireInSeconds?: number): Promise<string | null> {
    try {
      const data = typeof value === "string" ? value : JSON.stringify(value);
      if (expireInSeconds && Number(expireInSeconds) > 0) {
        return await client.set(key, data, "EX", Math.floor(expireInSeconds));
      }
      return await client.set(key, data);
    } catch (error) {
      const err = error as Error;
      console.warn(`[Auth-Redis] Cache SET failed for key "${key}":`, err.message);
      return null;
    }
  },

  /**
   * Get and parse JSON/string from Redis
   */
  async get<T = unknown>(key: string): Promise<T | string | null> {
    try {
      const data = await client.get(key);
      if (!data) return null;
      try {
        return JSON.parse(data) as T;
      } catch {
        return data;
      }
    } catch (error) {
      const err = error as Error;
      console.warn(`[Auth-Redis] Cache GET failed for key "${key}":`, err.message);
      return null;
    }
  },

  /**
   * Delete key from Redis
   */
  async del(key: string): Promise<number | null> {
    try {
      return await client.del(key);
    } catch (error) {
      const err = error as Error;
      console.warn(`[Auth-Redis] Cache DEL failed for key "${key}":`, err.message);
      return null;
    }
  },

  /**
   * Delete keys by pattern
   */
  async delPattern(pattern: string): Promise<boolean> {
    try {
      const stream = client.scanStream({
        match: pattern,
        count: 100,
      });

      return new Promise<boolean>((resolve) => {
        stream.on("data", async (keys: string[]) => {
          if (keys && keys.length) {
            try {
              const pipeline = client.pipeline();
              keys.forEach((k) => pipeline.del(k));
              await pipeline.exec();
            } catch (e) {
              const err = e as Error;
              console.warn("[Auth-Redis] Pipeline delete error:", err.message);
            }
          }
        });
        stream.on("end", () => resolve(true));
        stream.on("error", (err: Error) => {
          console.warn(`[Auth-Redis] delPattern stream error:`, err.message);
          resolve(false);
        });
      });
    } catch (error) {
      const err = error as Error;
      console.warn(`[Auth-Redis] Cache delPattern failed:`, err.message);
      return false;
    }
  },
};

export default CacheService;
module.exports = CacheService;
