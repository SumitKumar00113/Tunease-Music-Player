import app from "./app";
import { connectToRabbitMQ } from "./messageBroker/rabbit";
import startListener from "./listener/listener";

const startServer = async (): Promise<void> => {
  try {
    await connectToRabbitMQ();
    await startListener();
    app.listen(3001, () => {
      console.log("server is running on port 3001");
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Failed to start notification service:", message);
    process.exitCode = 1;
  }
};

startServer();
