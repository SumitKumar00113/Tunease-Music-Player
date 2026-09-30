    const mongoose=require("mongoose");



    const userSchema=new mongoose.Schema({
        email:{
            type:String,
            required:true,
        },
        mobileNo:{
            type:Number,
            required:function(){
                return !this.googleId;
            }
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
        profilePhoto:{
            type:String,
        },
        role:{
            type:String,
            enum:["user","seller","admin"],
            default:"user"
        },
        authProvider:{
            type:String,
            enum:['google',"local"],
            default:"local"
        }
    })


    const userModel=mongoose.model("user",userSchema);

    module.exports=userModel;