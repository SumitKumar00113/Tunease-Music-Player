const app=require("./src/app");
const {connectToRabbitMQ}=require("./src/messageBroker/rabbit");
const connectToDb=require("./src/db/db")

connectToDb();
connectToRabbitMQ()
app.listen(3000,()=>{
    console.log("server is running on port 3000")
})
