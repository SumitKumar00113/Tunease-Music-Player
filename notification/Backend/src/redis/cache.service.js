const client = require("./client.redis");
const _config = require("../config/config");

// Expiration TTLs (in seconds)
const EXPIRATION = {
    EMAIL_DEDUPLICATION: 24 * 60 * 60, // 24 hours (86400s)
    RATE_LIMIT_COOLDOWN: 60,           // 1 minute (60s)
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
            console.warn(`[Notification-Redis] Cache SET failed for key "${key}":`, error.message);
            return null;
        }
    },

    /**
     * Retrieve cached value (automatically parsed from JSON)
     * @param {string} key
     */
    async get(key) {
        if (_config.NODE_ENV === "test") {
            return null;
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
            console.warn(`[Notification-Redis] Cache GET failed for key "${key}":`, error.message);
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
            console.warn(`[Notification-Redis] Cache DEL failed for key "${key}":`, error.message);
            return null;
        }
    },
};

module.exports = CacheService;
