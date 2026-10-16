const { Redis } = require("ioredis");
const _config = require("../config/config");

const redisOptions = {
    maxRetriesPerRequest: 1,
    enableReadyCheck: true,
    lazyConnect: false,
    retryStrategy(times) {
        if (_config.NODE_ENV === "test") {
            return null; // Do not endlessly retry in tests
        }
        return Math.min(times * 150, 3000);
    },
};

let client;

if (_config.REDIS_URL) {
    client = new Redis(_config.REDIS_URL, redisOptions);
} else {
    client = new Redis({
        host: _config.REDIS_HOST || "127.0.0.1",
        port: _config.REDIS_PORT || 6379,
        password: _config.REDIS_PASSWORD || undefined,
        ...redisOptions,
    });
}

let hasLoggedRedisWarning = false;

client.on("connect", () => {
    hasLoggedRedisWarning = false;
    if (_config.NODE_ENV !== "test") {
        console.log("[Music-Redis] Successfully connected to Redis");
    }
});

client.on("error", (err) => {
    if (_config.NODE_ENV !== "test") {
        if (!hasLoggedRedisWarning) {
            hasLoggedRedisWarning = true;
            console.warn("[Music-Redis] Connection warning (Redis may not be running):", err.message);
        }
    }
});

module.exports = client;
