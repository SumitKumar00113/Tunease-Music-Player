const express=require("express");
const authController=require("../controller/auth.controller");
const authMiddleware=require('../middlewares/auth.middleware');
const tokenMiddleware=require("../middlewares/token.middleware");
const _config=require("../config/config");
const passport=require("passport")
const jwt = require('jsonwebtoken');




const router=express.Router();

router.post("/register", authMiddleware.validateRegisterUser, authController.registerUser);
router.post("/login", authMiddleware.validateLoginUser, authController.loginUser);
router.post("/refresh", tokenMiddleware.refreshTokenValidate, authController.refreshAccessToken);
router.post("/logout", tokenMiddleware.accessTokenValidate, authController.logoutUser);
router.post("/delete", tokenMiddleware.accessTokenValidate, authController.logoutUser);
router.get("/me", tokenMiddleware.accessTokenValidate, authController.getUserProfile);

// Route to initiate Google OAuth flow
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback route that Google will redirect to after authentication
router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  authController.googleAuthCallBack
);

module.exports=router