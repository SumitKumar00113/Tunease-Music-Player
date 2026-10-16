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

    it("connects using the configured RabbitMQ URL and creates a channel", async () => {
        const rabbitUrl = "amqp://localhost:5672";
        const channel = { on: jest.fn() };
        const connection = {
            createConfirmChannel: jest.fn().mockResolvedValue(channel),
            on: jest.fn(),
        };
        const { rabbit, connect } = loadRabbitModule(rabbitUrl);
        connect.mockResolvedValue(connection);
        jest.spyOn(console, "log").mockImplementation(() => {});

        await rabbit.connectToRabbitMQ();

        expect(connect).toHaveBeenCalledWith(rabbitUrl);
        expect(connection.createConfirmChannel).toHaveBeenCalledTimes(1);
    });

    it("rejects with a clear error when RABBIT_MQ_URL is missing", async () => {
        const { rabbit, connect } = loadRabbitModule(undefined);

        await expect(rabbit.connectToRabbitMQ()).rejects.toThrow(
            "RABBIT_MQ_URL is not set"
        );
        expect(connect).not.toHaveBeenCalled();
    });

    it("propagates errors when RabbitMQ cannot be reached", async () => {
        const connectionError = new Error("broker unavailable");
        const { rabbit, connect } = loadRabbitModule("amqp://localhost:5672");
        connect.mockRejectedValue(connectionError);

        await expect(rabbit.connectToRabbitMQ()).rejects.toBe(connectionError);
    });

    it("declares the queue before consuming and acknowledges successful messages", async () => {
        let consumeMessage;
        const channel = {
            assertQueue: jest.fn().mockResolvedValue(undefined),
            consume: jest.fn((queueName, callback) => {
                consumeMessage = callback;
                return Promise.resolve({ consumerTag: "consumer-tag" });
            }),
            ack: jest.fn(),
            nack: jest.fn(),
            on: jest.fn(),
        };
        const connection = {
            createConfirmChannel: jest.fn().mockResolvedValue(channel),
            on: jest.fn(),
        };
        const { rabbit, connect } = loadRabbitModule("amqp://localhost:5672");
        connect.mockResolvedValue(connection);
        jest.spyOn(console, "log").mockImplementation(() => {});
        const callback = jest.fn().mockResolvedValue(undefined);
        const message = { content: Buffer.from('{"email":"sam@example.com"}') };

        await rabbit.connectToRabbitMQ();
        await rabbit.subscribeToQueue("user_created", callback);
        await consumeMessage(message);

        expect(channel.assertQueue).toHaveBeenCalledWith("user_created", {
            durable: true,
        });
        expect(callback).toHaveBeenCalledWith({ email: "sam@example.com" });
        expect(channel.ack).toHaveBeenCalledWith(message);
        expect(channel.nack).not.toHaveBeenCalled();
    });

    it("requeues messages when processing fails instead of acknowledging them", async () => {
        let consumeMessage;
        const channel = {
            assertQueue: jest.fn().mockResolvedValue(undefined),
            consume: jest.fn((queueName, callback) => {
                consumeMessage = callback;
                return Promise.resolve({ consumerTag: "consumer-tag" });
            }),
            ack: jest.fn(),
            nack: jest.fn(),
            on: jest.fn(),
        };
        const connection = {
            createConfirmChannel: jest.fn().mockResolvedValue(channel),
            on: jest.fn(),
        };
        const { rabbit, connect } = loadRabbitModule("amqp://localhost:5672");
        connect.mockResolvedValue(connection);
        jest.spyOn(console, "log").mockImplementation(() => {});
        jest.spyOn(console, "error").mockImplementation(() => {});
        const callback = jest.fn().mockRejectedValue(new Error("SMTP failed"));
        const message = { content: Buffer.from('{"email":"sam@example.com"}') };

        await rabbit.connectToRabbitMQ();
        await rabbit.subscribeToQueue("user_created", callback);
        await consumeMessage(message);

        expect(channel.ack).not.toHaveBeenCalled();
        expect(channel.nack).toHaveBeenCalledWith(message, false, true);
    });
});