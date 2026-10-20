import express, { Application, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import authRouter from "./routes/auth.routes";
import _config from "./config/config";

const app: Application = express();
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
app.use(express.json());
if (_config.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}
app.use(cookieParser());

// Static file middleware to serve built Vite frontend assets
const publicDir = path.join(__dirname, "../public");
app.use(express.static(publicDir));

app.use(passport.initialize());

// Configure Passport to use Google OAuth 2.0 strategy
if (_config.GOOGLE_CLIENT_ID && _config.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: _config.GOOGLE_CLIENT_ID,
        clientSecret: _config.GOOGLE_CLIENT_SECRET,
        callbackURL: _config.GOOGLE_CALLBACK_URL,
      },
      (_accessToken: string, _refreshToken: string, profile: Profile, done: VerifyCallback) => {
        done(null, profile);
      }
    )
  );
}

app.use("/api/auth", authRouter);

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
  });
});

// SPA fallback: Serve frontend index.html for client-side routing, or status message
app.use((_req: Request, res: Response) => {
  const indexPath = path.join(publicDir, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
    return;
  }
  res.status(200).send("Tunease Auth Service is running");
});

export default app;
module.exports = app;
