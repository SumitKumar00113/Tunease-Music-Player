const amqplib=require("amqplib");
const _config=require("../config/config");



let channel;
let connection;
let connecting;
let reconnectTimer;
let reconnectDelay = 1000;
const subscriptions = new Map();


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

const consumeQueue = async (activeChannel, queueName, callBack) => {
    await activeChannel.assertQueue(queueName, { durable: true });

    return activeChannel.consume(queueName, async (msg) => {
        if (!msg) return;

        console.log("📩 MESSAGE RECEIVED:", msg.content.toString());

        try {
            await callBack(JSON.parse(msg.content.toString()));

            console.log("✅ MESSAGE PROCESSED");

            activeChannel.ack(msg);
        } catch (error) {
            console.error(`❌ Failed to process message from ${queueName}:`, error);
            const shouldRequeue = !msg.fields?.redelivered;
            if (!shouldRequeue) {
                console.warn(`⚠️ Message from ${queueName} failed after redelivery. Discarding to prevent infinite loop.`);
            }
            activeChannel.nack(msg, false, shouldRequeue);
        }
    });
};


const connectToRabbitMQ=async()=>{
    if(!_config.RABBIT_MQ_URL){
        throw new Error("RABBIT_MQ_URL is not set. Configure it in the notification backend .env file.");
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

        for (const [queueName, callBack] of subscriptions) {
            await consumeQueue(newChannel, queueName, callBack);
        }

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

const subscribeToQueue = async (queueName, callBack) => {
    subscriptions.set(queueName, callBack);
    const activeChannel = channel || await connectToRabbitMQ();
    return consumeQueue(activeChannel, queueName, callBack);
};
module.exports={connectToRabbitMQ,publishToQueue,subscribeToQueue}