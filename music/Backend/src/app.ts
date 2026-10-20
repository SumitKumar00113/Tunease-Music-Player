import express, { Request, Response, NextFunction } from "express";
import multer from "multer";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import musicRoutes from "./routes/music.routes";
import cors from "cors";
import { globalRateLimiter } from "./middleware/rate-limit.middleware";

import path from "path";
import fs from "fs";

const app = express();
app.set("trust proxy", 1);
const allowedOrigins = new Set([
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
  "https://tunease-auth-service-latest.onrender.com",
  "https://tunease-music-service-latest.onrender.com",
]);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Origin is not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use("/api", globalRateLimiter);
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/music", musicRoutes);

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

const publicDir = fs.existsSync(path.resolve(__dirname, "../public"))
  ? path.resolve(__dirname, "../public")
  : path.resolve(process.cwd(), "public");

app.use(express.static(publicDir));

app.get("/{*splat}", (req: Request, res: Response) => {
  const indexPath = path.join(publicDir, "index.html");
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  return res.status(200).send("Tunease Music Service is running");
});

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    const tooLarge = err.code === "LIMIT_FILE_SIZE";
    return res.status(tooLarge ? 413 : 400).json({
      message: tooLarge
        ? "An uploaded file exceeds the 50 MiB request limit."
        : "The uploaded files could not be accepted.",
    });
  }
  const name = err instanceof Error ? err.name : "Error";
  console.error("Unhandled music API error:", name);
  return res.status(500).json({ message: "Internal server error" });
});

export default app;
module.exports = app;
