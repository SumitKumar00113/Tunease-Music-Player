const express=require('express');
const cors=require('cors');
const morgan=require("morgan");
const cookieParser=require("cookie-parser");
const path = require('path');
const fs = require('fs');
const authRouter=require('../src/routes/auth.routes');
const passport = require('passport');

const {Strategy:GoogleStrategy}=require("passport-google-oauth20");
const _config=require("./config/config");
const app=express();
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

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Origin is not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

// Static file middleware to serve built Vite frontend assets
const publicDir = path.join(__dirname, '../public');
app.use(express.static(publicDir));

app.use(passport.initialize());
// Configure Passport to use Google OAuth 2.0 strategy
if (_config.GOOGLE_CLIENT_ID && _config.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: _config.GOOGLE_CLIENT_ID,
    clientSecret: _config.GOOGLE_CLIENT_SECRET,
    callbackURL: _config.GOOGLE_CALLBACK_URL,
  }, (accessToken, refreshToken, profile, done) => done(null, profile)));
}

app.use("/api/auth",authRouter);

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok"
    });
});

// SPA fallback: Serve frontend index.html for client-side routing, or status message
app.use((req, res) => {
    const indexPath = path.join(publicDir, 'index.html');
    if (fs.existsSync(indexPath)) {
        return res.sendFile(indexPath);
    }
    res.status(200).send("Tunease Auth Service is running");
});

module.exports=app;
