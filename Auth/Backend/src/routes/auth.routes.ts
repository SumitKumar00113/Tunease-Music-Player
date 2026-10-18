import express, { Request, Response, NextFunction } from "express";
import passport from "passport";
import * as authController from "../controller/auth.controller";
import * as authMiddleware from "../middlewares/auth.middleware";
import * as tokenMiddleware from "../middlewares/token.middleware";
import * as verificationController from "../controller/verification.controller";
import _config from "../config/config";

const router = express.Router();

export const requireGoogleOAuthConfig = (req: Request, res: Response, next: NextFunction): void => {
  if (!_config.GOOGLE_CLIENT_ID || !_config.GOOGLE_CLIENT_SECRET) {
    res.status(503).json({
      message: "Google sign-in is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET on the auth backend.",
    });
    return;
  }
  next();
};

router.post("/register", authMiddleware.validateRegisterUser, authController.registerUser);
router.post("/login", authMiddleware.validateLoginUser, authController.loginUser);
router.post("/refresh", tokenMiddleware.refreshTokenValidate, authController.refreshAccessToken);
router.post("/logout", tokenMiddleware.accessTokenValidate, authController.logoutUser);
router.post("/delete", tokenMiddleware.accessTokenValidate, authController.logoutUser);
router.get("/me", tokenMiddleware.accessTokenValidate, authController.getUserProfile);
router.put("/profile", tokenMiddleware.accessTokenValidate, authController.updateUserProfile);
router.patch("/profile", tokenMiddleware.accessTokenValidate, authController.updateUserProfile);
router.post("/requestEmailOTP", tokenMiddleware.accessTokenValidate, verificationController.requestEmailOTP);
router.post("/requestMobileOTP", tokenMiddleware.accessTokenValidate, verificationController.requestMobileOtp);
router.post("/verifyEmailOtp", tokenMiddleware.accessTokenValidate, verificationController.verifyEmailOtp);
router.post("/verifyMobileOtp", tokenMiddleware.accessTokenValidate, verificationController.verifyMobileOtp);

// Route to initiate Google OAuth flow
router.get(
  "/google",
  requireGoogleOAuthConfig,
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback route that Google will redirect to after authentication
router.get(
  "/google/callback",
  requireGoogleOAuthConfig,
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${_config.CLIENT_URL}/login?error=google_auth_failed`,
  }),
  authController.googleAuthCallBack
);

export default router;
module.exports = router;
