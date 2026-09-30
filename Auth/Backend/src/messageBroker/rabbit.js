const amqplib=require('amqplib')
const _config=require("../config/config");






let channel,connection;


const connectToRabbitMQ=async()=>{
    connection=await amqplib.connect(_config.RABBIT_MQ_URL);
    channel=connection.createChannel();
    console.log("connected to Rabbit MQ");
    return;
}

const publishToQueue=async(queueName,data)=>{
    await channel.assertQueue(queueName,{durable:true});
    await channel.sendToQueue(queueName,Buffer.from(JSON.stringify(data)))
    return;
}


module.exports={connectToRabbitMQ,publishToQueue}