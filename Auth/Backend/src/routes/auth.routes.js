const express=require("express");
const authController=require("../controller/auth.controller");
const authMiddleware=require('../middlewares/auth.middleware');
const tokenMiddleware=require("../middlewares/token.middleware");




const router=express.Router();

router.post("/register",authMiddleware.validateRegisterUser,authController.registerUser)
router.post('/login',authMiddleware.validateLoginUser,authController.loginUser);
router.post("/refresh",tokenMiddleware.refreshTokenValidate,authController.refreshAccessToken)
router.post("/delete",tokenMiddleware.accessTokenValidate,authController.logoutUser)


module.exports=router