const app=require('./src/app');
const {connectToRabbitMQ}=require('./src/messageBroker/rabbit');
const startListener=require('./src/listener/listener');

const startServer=async()=>{
    try{
        await connectToRabbitMQ();
        await startListener();
        app.listen(3001,()=>{
            console.log("server is running on port 3001")
        });
    }catch(error){
        console.error("Failed to start notification service:",error.message);
        process.exitCode=1;
    }
};

startServer();