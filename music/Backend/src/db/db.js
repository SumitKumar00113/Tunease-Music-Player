const mongoose=require("mongoose");
const _config=require('../config/config');




const connectToDb=async()=>{
    try{
await mongoose.connect(_config.MONGO_URI);
console.log("connected to Database")
    }catch(err){
        console.log("error during connect to Database",err)
    }
}
module.exports=connectToDb;