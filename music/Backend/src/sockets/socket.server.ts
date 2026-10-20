import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import _config from "../config/config";
import { AuthUser } from "../middleware/auth.middleware";
import client from "../redis/client.redis";
import { ipKeyGenerator } from "express-rate-limit";
import { z } from "zod";

const playPayloadSchema = z.union([z.string().min(1).max(120), z.object({ musicId: z.string().min(1).max(120) })]);

export interface CustomSocket extends Socket {
  user?: AuthUser;
}

function parseCookies(rawCookie: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!rawCookie) return cookies;
  const pairs = rawCookie.split(";");
  for (const pair of pairs) {
    const idx = pair.indexOf("=");
    if (idx > -1) {
      const key = pair.slice(0, idx).trim();
      const val = pair.slice(idx + 1).trim();
      try {
        cookies[key] = decodeURIComponent(val);
      } catch {
        cookies[key] = val;
      }
    }
  }
  return cookies;
}

export const initiateSocketServer = async (httpServer: HttpServer): Promise<void> => {
  const io = new Server(httpServer, {
    cors: {
      origin: [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://tunease-music-service-latest.onrender.com",
        "https://tunease-auth-service-latest.onrender.com",
      ],
      credentials: true,
    },
  });

  io.use((socket: CustomSocket, next) => {
    try {
      void (async () => {
        const address = socket.handshake.address || "0.0.0.0";
        const key = `music:limit:socket:connection:${ipKeyGenerator(address)}`;
        const count = await client.incr(key);
        if (count === 1) await client.expire(key, 60);
        if (count > 20) { next(new Error("Too many socket connections. Try again in one minute.")); return; }
        validateSocketToken(socket, next);
      })().catch(() => next(new Error("Socket connection could not be verified.")));
    } catch {
      return next(new Error("Socket connection could not be verified."));
    }
  });

  io.on("connection", (socket: CustomSocket) => {
    const userId = socket.user?.id || socket.user?._id;
    if (userId) socket.join(userId);

    let tokens = 30;
    let lastRefill = Date.now();
    let violations = 0;
    socket.use((_packet, next) => {
      const now = Date.now();
      tokens = Math.min(30, tokens + ((now - lastRefill) / 10000) * 30);
      lastRefill = now;
      if (tokens >= 1) { tokens -= 1; next(); return; }
      violations += 1;
      socket.emit("rate_limit", { retryAfter: Math.max(1, Math.ceil((1 - tokens) * 10000 / 30)) });
      if (violations >= 3) socket.disconnect(true);
      next(new Error("Too many events. Please slow down."));
    });

    socket.on("play", (data: unknown) => {
      const parsed = playPayloadSchema.safeParse(data);
      if (!parsed.success || !userId) return;
      const musicId = typeof parsed.data === "string" ? parsed.data : parsed.data.musicId;
      socket.broadcast.to(userId).emit("play", musicId);
    });

    socket.on("disconnect", () => {
      if (userId) socket.leave(userId);
    });
  });
};

function validateSocketToken(socket: CustomSocket, next: (error?: Error) => void): void {
  try {
      const rawCookie = socket.handshake.headers?.cookie || "";
      const cookies = parseCookies(rawCookie);
      const accessToken = cookies.accessToken || (socket.handshake.auth as { token?: string })?.token;

      if (!accessToken) {
        return next(new Error("Authentication error: Token missing"));
      }

      if (!_config.JWT_ACCESS_TOKEN_SECRET_KEY) {
        return next(new Error("Authentication error: Secret key missing"));
      }

      const decoded = jwt.verify(accessToken, _config.JWT_ACCESS_TOKEN_SECRET_KEY) as AuthUser;
      socket.user = decoded;
      return next();
    } catch {
      return next(new Error("Authentication error: Invalid token"));
    }
}

export default initiateSocketServer;
module.exports = initiateSocketServer;
