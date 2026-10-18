import app from "./app";
import { connectToRabbitMQ } from "./messageBroker/rabbit";
import connectToDb from "./db/db";

const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

export const startServer = async (): Promise<void> => {
  try {
    await connectToDb();
    await connectToRabbitMQ();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    const err = error as Error;
    console.error("Failed to start auth service:", err.message);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== "test") {
  startServer();
}

export default startServer;
