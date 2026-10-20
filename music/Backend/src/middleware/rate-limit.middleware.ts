import { ipKeyGenerator, MemoryStore, rateLimit, type Options, type RateLimitRequestHandler } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import type { Request } from "express";
import client from "../redis/client.redis";
import type { AuthenticatedRequest } from "./auth.middleware";

type LimiterConfig = { limit: number; windowMs: number; prefix: string; perUser?: boolean };

function storeFor(prefix: string, windowMs: number): Options["store"] {
  if (process.env.NODE_ENV === "test") return new MemoryStore();
  return new RedisStore({
    prefix,
    sendCommand: async (...args: string[]) => {
      const [command, ...parameters] = args;
      return client.call(command, ...parameters) as Promise<string | number | boolean | Array<string | number | boolean>>;
    },
  });
}

function actorKey(request: Request, perUser: boolean): string {
  const authenticated = request as AuthenticatedRequest;
  const userId = authenticated.user?.id || authenticated.user?._id;
  if (perUser && userId) return `user:${userId}`;
  return `ip:${ipKeyGenerator(request.ip || "0.0.0.0")}`;
}

export function createRateLimiter({ limit, windowMs, prefix, perUser = false }: LimiterConfig): RateLimitRequestHandler {
  return rateLimit({
    windowMs,
    limit,
    store: storeFor(prefix, windowMs),
    keyGenerator: (request) => actorKey(request, perUser),
    standardHeaders: "draft-8",
    legacyHeaders: false,
    handler: (request, response) => {
      const rateLimitInfo = (request as Request & { rateLimit?: { resetTime?: Date } }).rateLimit;
      const retryAfter = Math.max(1, Math.ceil(((rateLimitInfo?.resetTime?.getTime() || Date.now() + windowMs) - Date.now()) / 1000));
      response.setHeader("Retry-After", String(retryAfter));
      response.status(429).json({ error: "Too many requests", retryAfter });
    },
  });
}

export const globalRateLimiter = createRateLimiter({ limit: 200, windowMs: 15 * 60 * 1000, prefix: "music:limit:global:", perUser: false });
export const authenticatedRateLimiter = createRateLimiter({ limit: 200, windowMs: 15 * 60 * 1000, prefix: "music:limit:user:", perUser: true });
export const searchRateLimiter = createRateLimiter({ limit: 30, windowMs: 60 * 1000, prefix: "music:limit:search:", perUser: true });
export const uploadRateLimiter = createRateLimiter({ limit: 10, windowMs: 60 * 60 * 1000, prefix: "music:limit:upload:", perUser: true });
export const playlistRateLimiter = createRateLimiter({ limit: 60, windowMs: 60 * 60 * 1000, prefix: "music:limit:playlist:", perUser: true });

export default { globalRateLimiter, authenticatedRateLimiter, searchRateLimiter, uploadRateLimiter, playlistRateLimiter, createRateLimiter };
