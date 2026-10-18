import { Redis, RedisOptions } from "ioredis";
import _config from "../config/config";

const redisOptions: RedisOptions = {
  maxRetriesPerRequest: 1,
  enableReadyCheck: true,
  lazyConnect: false,
  retryStrategy(times: number) {
    if (_config.NODE_ENV === "test") {
      return null;
    }
    return Math.min(times * 150, 3000);
  },
};

let client: Redis;

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

client.on("error", (err: Error) => {
  if (_config.NODE_ENV !== "test") {
    if (!hasLoggedRedisWarning) {
      hasLoggedRedisWarning = true;
      console.warn("[Music-Redis] Connection warning (Redis may not be running):", err.message);
    }
  }
});

export default client;
module.exports = client;
