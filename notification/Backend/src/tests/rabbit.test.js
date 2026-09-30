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
        const channel = {};
        const connection = { createChannel: jest.fn().mockResolvedValue(channel) };
        const { rabbit, connect } = loadRabbitModule(rabbitUrl);
        connect.mockResolvedValue(connection);
        jest.spyOn(console, "log").mockImplementation(() => {});

        await rabbit.connectToRabbitMQ();

        expect(connect).toHaveBeenCalledWith(rabbitUrl);
        expect(connection.createChannel).toHaveBeenCalledTimes(1);
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
});