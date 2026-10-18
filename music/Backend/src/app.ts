import express, { Request, Response, NextFunction } from "express";
import multer from "multer";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import musicRoutes from "./routes/music.routes";
import cors from "cors";

import path from "path";
import fs from "fs";

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:")
      ) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);

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
        ? "An uploaded file exceeds the 20 MiB request limit."
        : "The uploaded files could not be accepted.",
    });
  }
  const name = err instanceof Error ? err.name : "Error";
  console.error("Unhandled music API error:", name);
  return res.status(500).json({ message: "Internal server error" });
});

export default app;
module.exports = app;
