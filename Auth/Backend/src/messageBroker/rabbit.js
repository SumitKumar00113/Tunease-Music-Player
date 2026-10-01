const amqplib=require('amqplib')
const _config=require("../config/config");






let channel;
let connection;
let connecting;
let reconnectTimer;
let reconnectDelay = 1000;

const scheduleReconnect = () => {
    if (reconnectTimer) return;

    reconnectTimer = setTimeout(async () => {
        reconnectTimer = null;
        try {
            await connectToRabbitMQ();
            reconnectDelay = 1000;
        } catch (error) {
            console.error("RabbitMQ reconnect failed:", error.message);
            reconnectDelay = Math.min(reconnectDelay * 2, 30000);
            scheduleReconnect();
        }
    }, reconnectDelay);
};

const connectToRabbitMQ=async()=>{
    if(!_config.RABBIT_MQ_URL){
        throw new Error("RABBIT_MQ_URL is not set. Configure it in the Auth backend .env file.");
    }
    if (channel) return channel;
    if (connecting) return connecting;

    connecting = (async () => {
        if (!connection) {
            const newConnection = await amqplib.connect(_config.RABBIT_MQ_URL);
            connection = newConnection;
            newConnection.on("error", (error) => {
                console.error("RabbitMQ connection error:", error.message);
            });
            newConnection.on("close", () => {
                if (connection !== newConnection) return;
                connection = null;
                channel = null;
                console.error("RabbitMQ connection closed; reconnecting...");
                scheduleReconnect();
            });
        }

        const activeConnection = connection;
        const newChannel = await activeConnection.createConfirmChannel();
        channel = newChannel;
        newChannel.on("error", (error) => {
            console.error("RabbitMQ channel error:", error.message);
        });
        newChannel.on("close", () => {
            if (channel !== newChannel) return;
            channel = null;
            console.error("RabbitMQ channel closed; reconnecting...");
            scheduleReconnect();
        });
        console.log("connected to Rabbit MQ");
        return newChannel;
    })();

    try {
        return await connecting;
    } finally {
        connecting = null;
    }
}

const publishToQueue = async (queueName, data) => {
    const activeChannel = channel || await connectToRabbitMQ();

    await activeChannel.assertQueue(queueName, { durable: true });

    console.log("📤 PUBLISHING:", data);

    activeChannel.sendToQueue(
        queueName,
        Buffer.from(JSON.stringify(data))
    );
    await activeChannel.waitForConfirms();

    console.log("✅ PUBLISHED TO:", queueName);
};


module.exports={connectToRabbitMQ,publishToQueue}