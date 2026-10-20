const express = require("express");
const authController = require("../controller/auth.controller");
const authMiddleware = require('../middlewares/auth.middleware');
const tokenMiddleware = require("../middlewares/token.middleware");
const _config = require("../config/config");
const passport = require("passport")
const jwt = require('jsonwebtoken');
const { requestEmailOTP, requestMobileOtp, verifyEmailOtp, verifyMobileOtp } = require("../controller/verification.controller");



const router = express.Router();

const requireGoogleOAuthConfig = (req, res, next) => {
  if (!_config.GOOGLE_CLIENT_ID || !_config.GOOGLE_CLIENT_SECRET) {
    return res.status(503).json({
      message: "Google sign-in is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET on the auth backend.",
    });
  }
  next();
};

router.post("/register", authMiddleware.validateRegisterUser, authController.registerUser);
router.post("/login", authMiddleware.validateLoginUser, authController.loginUser);
router.post("/refresh", tokenMiddleware.refreshTokenValidate, authController.refreshAccessToken);
router.post("/logout", tokenMiddleware.accessTokenValidate, authController.logoutUser);
router.post("/delete", tokenMiddleware.accessTokenValidate, authController.logoutUser);
router.get("/me", tokenMiddleware.accessTokenValidate, authController.getUserProfile);
router.get("/session-token", tokenMiddleware.accessTokenValidate, authController.issueSessionToken);
router.put("/profile", tokenMiddleware.accessTokenValidate, authController.updateUserProfile);
router.patch("/profile", tokenMiddleware.accessTokenValidate, authController.updateUserProfile);
router.post("/requestEmailOTP", tokenMiddleware.accessTokenValidate, requestEmailOTP);
router.post("/requestMobileOTP", tokenMiddleware.accessTokenValidate, requestMobileOtp);
router.post("/verifyEmailOtp", tokenMiddleware.accessTokenValidate, verifyEmailOtp);
router.post("/verifyMobileOtp", tokenMiddleware.accessTokenValidate, verifyMobileOtp);
// Route to initiate Google OAuth flow
router.get('/google', requireGoogleOAuthConfig, (req, res, next) => {
  const returnTo = typeof req.query.returnTo === 'string' ? req.query.returnTo : '';
  let state = '';
  try {
    const target = new URL(returnTo);
    if (target.origin === 'https://tunease-music-service-latest.onrender.com') {
      state = Buffer.from(target.href).toString('base64url');
    }
  } catch {
    // No valid player return URL was provided.
  }
  passport.authenticate('google', { scope: ['profile', 'email'], state })(req, res, next);
});

// Callback route that Google will redirect to after authentication
router.get('/google/callback',
  requireGoogleOAuthConfig,
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${_config.CLIENT_URL}/login?error=google_auth_failed`,
  }),
  authController.googleAuthCallBack
);

module.exports = router
