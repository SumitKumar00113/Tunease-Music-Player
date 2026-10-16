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

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman) or any local dev port
    if (!origin || origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
      callback(null, true);
    } else {
      callback(null, true);
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
