import client from "./client.redis";
import _config from "../config/config";

export interface CacheExpiration {
  ALL_MUSIC: number;
  ARTIST_MUSIC: number;
  USER_PLAYLISTS: number;
  PLAYLIST_DETAIL: number;
  PLAYLIST_MUSIC: number;
}

const EXPIRATION: CacheExpiration = {
  ALL_MUSIC: 15 * 60,      // 15 minutes (900s)
  ARTIST_MUSIC: 15 * 60,   // 15 minutes (900s)
  USER_PLAYLISTS: 10 * 60, // 10 minutes (600s)
  PLAYLIST_DETAIL: 10 * 60,// 10 minutes (600s)
  PLAYLIST_MUSIC: 10 * 60, // 10 minutes (600s)
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
      console.warn(`[Music-Redis] Cache SET failed for key "${key}":`, message);
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
      console.warn(`[Music-Redis] Cache GET failed for key "${key}":`, message);
      return null;
    }
  },

  async del(key: string): Promise<number | null> {
    try {
      return await client.del(key);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[Music-Redis] Cache DEL failed for key "${key}":`, message);
      return null;
    }
  },

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
            } catch (e: unknown) {
              const message = e instanceof Error ? e.message : String(e);
              console.warn("[Music-Redis] Pipeline delete error:", message);
            }
          }
        });
        stream.on("end", () => resolve(true));
        stream.on("error", (err: Error) => {
          console.warn(`[Music-Redis] delPattern stream error:`, err.message);
          resolve(false);
        });
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[Music-Redis] Cache delPattern failed:`, message);
      return false;
    }
  },
};

export default CacheService;
module.exports = CacheService;
