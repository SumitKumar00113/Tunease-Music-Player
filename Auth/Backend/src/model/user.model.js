    const mongoose=require("mongoose");



    const userSchema=new mongoose.Schema({
        email:{
            type:String,
            required:true,
        },
        mobileNo:{
            type:Number,
            required:true
        },
        fullName:{
            firstName:{
                type:String,
                required:true
            },
            lastName:{
                type:String,
            },
        },
        googleId:{
            type:String,
        },
        password:{
        type:String,
        required:function(){
            return !this.googleId
        }
        },
        role:{
            type:String,
            enum:["user","seller","admin"],
            default:"user"
        }
    })


    const userModel=mongoose.model("user",userSchema);

    module.exports=userModel;