import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import _config from "../config/config";
import { AuthUser } from "../middleware/auth.middleware";

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
        "http://localhost:3005",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
      ],
      credentials: true,
    },
  });

  io.use((socket: CustomSocket, next) => {
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
  });

  io.on("connection", (socket: CustomSocket) => {
    console.log(`${socket.id} connected`);
    const userId = socket.user?.id || socket.user?._id;
    if (userId) {
      socket.join(userId);
    }

    socket.on("play", (data: { musicId?: string } | string) => {
      const musicId = typeof data === "object" ? data?.musicId : data;
      if (userId && musicId) {
        socket.broadcast.to(userId).emit("play", musicId);
      }
    });

    socket.on("disconnect", () => {
      console.log(`${socket.id} disconnected`);
      if (userId) {
        socket.leave(userId);
      }
    });
  });
};

export default initiateSocketServer;
module.exports = initiateSocketServer;
