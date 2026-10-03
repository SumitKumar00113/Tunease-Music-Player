const express=require('express');
const multer=require("multer");
const musicMiddleware=require("../middleware/auth.middleware");




const router=express.Router();

const upload=new multer({
    storage:memory.memoryStorage()
})

router.post('/upload',musicMiddleware.artistValidate,upload.fields([{
name:'music',maxCount:1
},{name:"coverImage",maxCount:1}],))

module.exports=router;
