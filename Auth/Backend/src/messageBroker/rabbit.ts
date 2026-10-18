import amqplib, { ChannelModel, ConfirmChannel } from "amqplib";
import _config from "../config/config";

let channel: ConfirmChannel | null = null;
let connection: ChannelModel | null = null;
let connecting: Promise<ConfirmChannel> | null = null;
let reconnectTimer: NodeJS.Timeout | null = null;
let reconnectDelay = 1000;

export const scheduleReconnect = (): void => {
  if (reconnectTimer) return;

  reconnectTimer = setTimeout(async () => {
    reconnectTimer = null;
    try {
      await connectToRabbitMQ();
      reconnectDelay = 1000;
    } catch (error) {
      const err = error as Error;
      console.error("RabbitMQ reconnect failed:", err.message);
      reconnectDelay = Math.min(reconnectDelay * 2, 30000);
      scheduleReconnect();
    }
  }, reconnectDelay);
};

export const connectToRabbitMQ = async (): Promise<ConfirmChannel> => {
  if (!_config.RABBIT_MQ_URL) {
    throw new Error("RABBIT_MQ_URL is not set. Configure it in the Auth backend .env file.");
  }
  if (channel) return channel;
  if (connecting) return connecting;

  connecting = (async () => {
    if (!connection) {
      const newConnection = await amqplib.connect(_config.RABBIT_MQ_URL!);
      connection = newConnection;
      newConnection.on("error", (error: Error) => {
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

    const activeConnection = connection!;
    const newChannel = await activeConnection.createConfirmChannel();
    channel = newChannel;
    newChannel.on("error", (error: Error) => {
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
};

export const publishToQueue = async (queueName: string, data: unknown): Promise<void> => {
  const activeChannel = channel || (await connectToRabbitMQ());

  await activeChannel.assertQueue(queueName, { durable: true });

  console.log("📤 PUBLISHING:", data);

  activeChannel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
  await activeChannel.waitForConfirms();

  console.log("✅ PUBLISHED TO:", queueName);
};

export default { connectToRabbitMQ, publishToQueue };
module.exports = { connectToRabbitMQ, publishToQueue };
