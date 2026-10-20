import express from "express";
import request from "supertest";
import { createRateLimiter } from "../middleware/rate-limit.middleware";
import type { AuthenticatedRequest } from "../middleware/auth.middleware";

function appWithLimiter(limit: number, windowMs: number, perUser = false) {
  const app = express();
  if (perUser) app.use((req, _res, next) => {
    const userId = req.header("x-test-user");
    if (userId) (req as AuthenticatedRequest).user = { id: userId };
    next();
  });
  app.use(createRateLimiter({ limit, windowMs, prefix: `test:${Math.random()}:`, perUser }));
  app.get("/", (_req, res) => res.status(200).json({ ok: true }));
  return app;
}

describe("Redis-backed rate limiter configuration", () => {
  it("allows requests under the configured limit", async () => {
    const app = appWithLimiter(2, 60_000);
    await request(app).get("/").expect(200);
    await request(app).get("/").expect(200);
  });

  it("returns a retry response after the request limit", async () => {
    const app = appWithLimiter(1, 60_000);
    await request(app).get("/").expect(200);
    const response = await request(app).get("/").expect(429);
    expect(response.body).toEqual({ error: "Too many requests", retryAfter: expect.any(Number) });
    expect(response.headers["retry-after"]).toBeDefined();
    expect(response.headers.ratelimit).toBeDefined();
  });

  it("resets the window after the configured period", async () => {
    const app = appWithLimiter(1, 100);
    await request(app).get("/").expect(200);
    await request(app).get("/").expect(429);
    await new Promise((resolve) => setTimeout(resolve, 130));
    await request(app).get("/").expect(200);
  });

  it("keeps authenticated users in independent buckets", async () => {
    const app = appWithLimiter(1, 60_000, true);
    await request(app).get("/").set("x-test-user", "listener-a").expect(200);
    await request(app).get("/").set("x-test-user", "listener-b").expect(200);
    await request(app).get("/").set("x-test-user", "listener-a").expect(429);
  });
});
