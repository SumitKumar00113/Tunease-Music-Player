const client = require("./client.redis");

// Expiry constants in seconds
const EXPIRATION = {
    USER_SESSION: 7 * 24 * 60 * 60, // 7 days (604800s)
    USER_PROFILE: 60 * 60,          // 1 hour (3600s)
    BLACKLIST_TOKEN: 15 * 60,       // 15 minutes (900s)
};

const CacheService = {
    client,
    EXPIRATION,

    /**
     * Store key with expiration in seconds
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
            console.warn(`[Auth-Redis] Cache SET failed for key "${key}":`, error.message);
            return null;
        }
    },

    /**
     * Get and parse JSON/string from Redis
     * @param {string} key
     */
    async get(key) {
        try {
            const data = await client.get(key);
            if (!data) return null;
            try {
                return JSON.parse(data);
            } catch {
                return data;
            }
        } catch (error) {
            console.warn(`[Auth-Redis] Cache GET failed for key "${key}":`, error.message);
            return null;
        }
    },

    /**
     * Delete key from Redis
     * @param {string} key
     */
    async del(key) {
        try {
            return await client.del(key);
        } catch (error) {
            console.warn(`[Auth-Redis] Cache DEL failed for key "${key}":`, error.message);
            return null;
        }
    },

    /**
     * Delete keys by pattern
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
                            console.warn("[Auth-Redis] Pipeline delete error:", e.message);
                        }
                    }
                });
                stream.on("end", () => resolve(true));
                stream.on("error", (err) => {
                    console.warn(`[Auth-Redis] delPattern stream error:`, err.message);
                    resolve(false);
                });
            });
        } catch (error) {
            console.warn(`[Auth-Redis] Cache delPattern failed:`, error.message);
            return false;
        }
    },
};

module.exports = CacheService;
