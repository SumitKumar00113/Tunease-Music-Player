const app = require("./src/app");
const { connectToRabbitMQ } = require("./src/messageBroker/rabbit");
const connectToDb = require("./src/db/db");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectToDb();
        await connectToRabbitMQ();

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server is running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Failed to start auth service:", error.message);
        process.exit(1);
    }
};

startServer();