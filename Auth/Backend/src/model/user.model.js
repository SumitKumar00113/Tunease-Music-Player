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
            enum:["user","artist","admin"],
            default:"user"
        },
        authProvider:{
            type:String,
            enum:['google',"local"],
            default:"local"
        },
        isEmailVerified:{
            type:Boolean,
            default:false,
        },
        isMobileNoVerified:{
            type:Boolean,
            default:false,
        }
    })


    const userModel=mongoose.model("user",userSchema);

    module.exports=userModel;