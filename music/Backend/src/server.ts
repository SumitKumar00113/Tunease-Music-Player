import http from "http";
import app from "./app";
import _config from "./config/config";
import connectToDb from "./db/db";
import initiateSocketServer from "./sockets/socket.server";

const httpServer = http.createServer(app);

const startServer = async (): Promise<void> => {
  try {
    await connectToDb();
    await initiateSocketServer(httpServer);
    const PORT = _config.PORT || 3002;

    httpServer.on("error", (err: NodeJS.ErrnoException) => {
      if (err.code === "EADDRINUSE") {
        console.error(`❌ Port ${PORT} is already in use by another process.`);
      } else {
        console.error("Server error:", err);
      }
      process.exit(1);
    });

    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err: unknown) {
    console.error("Error starting server:", err);
    process.exit(1);
  }
};

startServer();
