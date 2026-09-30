const express=require('express');
const cors=require('cors');
const morgan=require("morgan")
const cookieParser=require("cookie-parser")
const authRouter=require('../src/routes/auth.routes');
const passport = require('passport');

const {Strategy:GoogleStrategy}=require("passport-google-oauth20");
const _config=require("./config/config");
const app=express();

app.use(cors({
  origin: _config.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

app.use(passport.initialize());
// Configure Passport to use Google OAuth 2.0 strategy
passport.use(new GoogleStrategy({
  clientID: _config.GOOGLE_CLIENT_ID,
  clientSecret: _config.GOOGLE_CLIENT_SECRET,
  callbackURL: _config.GOOGLE_CALLBACK_URL,
}, (accessToken, refreshToken, profile, done) => {
  // Here, you would typically find or create a user in your database
  // For this example, we'll just return the profile
  return done(null, profile);
}));

app.use("/api/auth",authRouter);

module.exports=app;