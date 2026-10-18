import amqplib, { ChannelModel, ConfirmChannel, ConsumeMessage } from "amqplib";
import _config from "../config/config";

let channel: ConfirmChannel | null = null;
let connection: ChannelModel | null = null;
let connecting: Promise<ConfirmChannel> | null = null;
let reconnectTimer: NodeJS.Timeout | null = null;
let reconnectDelay = 1000;

export type QueueCallback = (data: Record<string, unknown>) => Promise<void>;
const subscriptions = new Map<string, QueueCallback>();

const scheduleReconnect = (): void => {
  if (reconnectTimer) return;

  reconnectTimer = setTimeout(async () => {
    reconnectTimer = null;
    try {
      await connectToRabbitMQ();
      reconnectDelay = 1000;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("RabbitMQ reconnect failed:", message);
      reconnectDelay = Math.min(reconnectDelay * 2, 30000);
      scheduleReconnect();
    }
  }, reconnectDelay);
};

const consumeQueue = async (
  activeChannel: ConfirmChannel,
  queueName: string,
  callBack: QueueCallback
) => {
  await activeChannel.assertQueue(queueName, { durable: true });

  return activeChannel.consume(queueName, async (msg: ConsumeMessage | null) => {
    if (!msg) return;

    console.log("📩 MESSAGE RECEIVED:", msg.content.toString());

    try {
      await callBack(JSON.parse(msg.content.toString()));

      console.log("✅ MESSAGE PROCESSED");

      activeChannel.ack(msg);
    } catch (error: unknown) {
      console.error(`❌ Failed to process message from ${queueName}:`, error);
      const shouldRequeue = !msg.fields?.redelivered;
      if (!shouldRequeue) {
        console.warn(
          `⚠️ Message from ${queueName} failed after redelivery. Discarding to prevent infinite loop.`
        );
      }
      activeChannel.nack(msg, false, shouldRequeue);
    }
  });
};

export const connectToRabbitMQ = async (): Promise<ConfirmChannel> => {
  if (!_config.RABBIT_MQ_URL) {
    throw new Error(
      "RABBIT_MQ_URL is not set. Configure it in the notification backend .env file."
    );
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
};

export const publishToQueue = async (queueName: string, data: unknown): Promise<void> => {
  const activeChannel = channel || (await connectToRabbitMQ());

  await activeChannel.assertQueue(queueName, { durable: true });

  console.log("📤 PUBLISHING:", data);

  activeChannel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
  await activeChannel.waitForConfirms();

  console.log("✅ PUBLISHED TO:", queueName);
};

export const subscribeToQueue = async (
  queueName: string,
  callBack: QueueCallback
) => {
  subscriptions.set(queueName, callBack);
  const activeChannel = channel || (await connectToRabbitMQ());
  return consumeQueue(activeChannel, queueName, callBack);
};

module.exports = { connectToRabbitMQ, publishToQueue, subscribeToQueue };
