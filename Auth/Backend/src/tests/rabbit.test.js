const loadRabbitModule = (rabbitUrl) => {
    jest.resetModules();
    const connect = jest.fn();
    jest.doMock("amqplib", () => ({ connect }));
    jest.doMock("../config/config", () => ({ RABBIT_MQ_URL: rabbitUrl }));

    return {
        rabbit: require("../messageBroker/rabbit"),
        connect,
    };
};

describe("RabbitMQ connection", () => {
    afterEach(() => {
        jest.dontMock("amqplib");
        jest.dontMock("../config/config");
        jest.restoreAllMocks();
    });

    it("waits for a channel before publishing a message", async () => {
        const rabbitUrl = "amqp://localhost:5672";
        const payload = { email: "sam@example.com" };
        const channel = {
            assertQueue: jest.fn().mockResolvedValue(undefined),
            sendToQueue: jest.fn().mockReturnValue(true),
            waitForConfirms: jest.fn().mockResolvedValue(undefined),
            on: jest.fn(),
        };
        const connection = {
            createConfirmChannel: jest.fn().mockResolvedValue(channel),
            on: jest.fn(),
        };
        const { rabbit, connect } = loadRabbitModule(rabbitUrl);
        connect.mockResolvedValue(connection);
        jest.spyOn(console, "log").mockImplementation(() => {});

        await rabbit.connectToRabbitMQ();
        await rabbit.publishToQueue("user_created", payload);

        expect(connect).toHaveBeenCalledWith(rabbitUrl);
        expect(connection.createConfirmChannel).toHaveBeenCalledTimes(1);
        expect(channel.assertQueue).toHaveBeenCalledWith("user_created", {
            durable: true,
        });
        expect(channel.sendToQueue).toHaveBeenCalledWith(
            "user_created",
            Buffer.from(JSON.stringify(payload))
        );
        expect(channel.waitForConfirms).toHaveBeenCalledTimes(1);
    });

    it("rejects with a clear error when RABBIT_MQ_URL is missing", async () => {
        const { rabbit, connect } = loadRabbitModule(undefined);

        await expect(rabbit.connectToRabbitMQ()).rejects.toThrow(
            "RABBIT_MQ_URL is not set"
        );
        expect(connect).not.toHaveBeenCalled();
    });

    it("connects before publishing when the channel is unavailable", async () => {
        const channel = {
            assertQueue: jest.fn().mockResolvedValue(undefined),
            sendToQueue: jest.fn().mockReturnValue(true),
            waitForConfirms: jest.fn().mockResolvedValue(undefined),
            on: jest.fn(),
        };
        const connection = {
            createConfirmChannel: jest.fn().mockResolvedValue(channel),
            on: jest.fn(),
        };
        const { rabbit, connect } = loadRabbitModule("amqp://localhost:5672");
        connect.mockResolvedValue(connection);
        jest.spyOn(console, "log").mockImplementation(() => {});

        await rabbit.publishToQueue("user_created", { email: "sam@example.com" });

        expect(connect).toHaveBeenCalledWith("amqp://localhost:5672");
        expect(channel.sendToQueue).toHaveBeenCalledTimes(1);
        expect(channel.waitForConfirms).toHaveBeenCalledTimes(1);
    });
});