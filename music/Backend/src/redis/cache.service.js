const client = require("./client.redis");
const _config = require("../config/config");

// Cache expiration TTLs (in seconds)
const EXPIRATION = {
    ALL_MUSIC: 15 * 60,      // 15 minutes (900s)
    ARTIST_MUSIC: 15 * 60,   // 15 minutes (900s)
    USER_PLAYLISTS: 10 * 60, // 10 minutes (600s)
    PLAYLIST_DETAIL: 10 * 60,// 10 minutes (600s)
    PLAYLIST_MUSIC: 10 * 60, // 10 minutes (600s)
};

const CacheService = {
    client,
    EXPIRATION,

    /**
     * Store key in Redis with TTL in seconds
     * @param {string} key
     * @param {any} value
     * @param {number} expireInSeconds
     */
    async set(key, value, expireInSeconds) {
        try {
            const data = typeof value === "string" ? value : JSON.stringify(value);
            if (expireInSeconds && Number(expireInSeconds) > 0) {
                return await client.set(key, data, "EX", Math.floor(expireInSeconds));
            }
            return await client.set(key, data);
        } catch (error) {
            console.warn(`[Music-Redis] Cache SET failed for key "${key}":`, error.message);
            return null;
        }
    },

    /**
     * Retrieve cached value (automatically parsed from JSON)
     * @param {string} key
     */
    async get(key) {
        if (_config.NODE_ENV === "test") {
            return null; // Ensure unit tests test database queries and mocks directly
        }
        try {
            const data = await client.get(key);
            if (!data) return null;
            try {
                return JSON.parse(data);
            } catch {
                return data;
            }
        } catch (error) {
            console.warn(`[Music-Redis] Cache GET failed for key "${key}":`, error.message);
            return null;
        }
    },

    /**
     * Delete key from cache
     * @param {string} key
     */
    async del(key) {
        try {
            return await client.del(key);
        } catch (error) {
            console.warn(`[Music-Redis] Cache DEL failed for key "${key}":`, error.message);
            return null;
        }
    },

    /**
     * Invalidate all keys matching a pattern (e.g. 'music:artist:*', 'playlist:*')
     * @param {string} pattern
     */
    async delPattern(pattern) {
        try {
            const stream = client.scanStream({
                match: pattern,
                count: 100,
            });

            return new Promise((resolve) => {
                stream.on("data", async (keys) => {
                    if (keys && keys.length) {
                        try {
                            const pipeline = client.pipeline();
                            keys.forEach((k) => pipeline.del(k));
                            await pipeline.exec();
                        } catch (e) {
                            console.warn("[Music-Redis] Pipeline delete error:", e.message);
                        }
                    }
                });
                stream.on("end", () => resolve(true));
                stream.on("error", (err) => {
                    console.warn(`[Music-Redis] delPattern stream error:`, err.message);
                    resolve(false);
                });
            });
        } catch (error) {
            console.warn(`[Music-Redis] Cache delPattern failed:`, error.message);
            return false;
        }
    },
};

module.exports = CacheService;
