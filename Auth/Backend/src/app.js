const express=require('express');
const morgan=require("morgan")
const cookieParser=require("cookie-parser")
const authRouter=require('../src/routes/auth.routes');


const app=express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());


app.use("/api/auth",authRouter);

module.exports=app;