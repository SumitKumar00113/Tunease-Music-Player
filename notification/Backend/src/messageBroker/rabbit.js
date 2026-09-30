const amqplib=require("amqplib");
const _config=require("../config/config");



let channel,connection;



const connectToRabbitMQ=async()=>{
    if(!_config.RABBIT_MQ_URL){
        throw new Error("RABBIT_MQ_URL is not set. Configure it in the notification backend .env file.");
    }
    connection=await amqplib.connect(_config.RABBIT_MQ_URL);
    channel=await connection.createChannel();
    console.log("connected to Rabbit MQ");
}


const publishToQueue=async(queueName,data)=>{
    await channel.assertQueue(queueName,{durable:true});
    await channel.sendToQueue(queueName,Buffer.from(JSON.stringify(data)))
}

const subscribeToQueue=async(queueName,callBack)=>{
     channel.consume(queueName,async(msg)=>{
       await callBack(JSON.parse(msg.content.toString()))
        await channel.ack(msg);
    })
}

module.exports={connectToRabbitMQ,publishToQueue,subscribeToQueue}