const express=require("express");
const authController=require("../controller/auth.controller");
const authMiddleware=require('../middlewares/auth.middleware');
const tokenMiddleware=require("../middlewares/token.middleware");




const router=express.Router();

router.post("/register",authMiddleware.validateRegisterUser,authController.registerUser)



module.exports=router