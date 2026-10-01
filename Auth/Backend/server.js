const app=require("./src/app");
const {connectToRabbitMQ}=require("./src/messageBroker/rabbit");
const connectToDb=require("./src/db/db")

const startServer=async()=>{
    try{
        await connectToDb();
        await connectToRabbitMQ();
        app.listen(3000,()=>{
            console.log("server is running on port 3000")
        });
    }catch(error){
        console.error("Failed to start auth service:",error.message);
        process.exitCode=1;
    }
};

startServer();
