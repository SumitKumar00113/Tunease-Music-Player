const mockSend = jest.fn();

jest.mock("@aws-sdk/client-s3", () => ({
    S3Client: jest.fn(() => ({ send: mockSend })),
    PutObjectCommand: jest.fn(function (input) {
        this.input = input;
    }),
    GetObjectCommand: jest.fn(function (input) {
        this.input = input;
    }),
}));

jest.mock("@aws-sdk/s3-request-presigner", () => ({
    getSignedUrl: jest.fn(),
}));

jest.mock("uuid", () => ({
    v4: () => "test-uuid",
}));

const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { uploadFile, getPreSignerUrl } = require("../services/storage.service");

beforeEach(() => {
    jest.clearAllMocks();
});

describe("storage service", () => {
    it("uploads a Multer file using the required S3 Key field", async () => {
        mockSend.mockResolvedValue({});
        const file = {
            originalname: "track.mp3",
            buffer: Buffer.from("audio"),
        };

        const key = await uploadFile(file);

        expect(PutObjectCommand).toHaveBeenCalledWith({
            Bucket: "amzn-s3-tunease-bucket",
            Body: file.buffer,
            Key: key,
        });
        expect(key).toMatch(/-track\.mp3$/);
        expect(mockSend).toHaveBeenCalledTimes(1);
    });

    it("creates signed URLs using the required S3 Key field", async () => {
        getSignedUrl.mockResolvedValue("https://example.test/audio");

        await expect(getPreSignerUrl("audio-key")).resolves.toBe(
            "https://example.test/audio",
        );
        expect(GetObjectCommand).toHaveBeenCalledWith({
            Key: "audio-key",
            Bucket: "amzn-s3-tunease-bucket",
        });
    });
});
