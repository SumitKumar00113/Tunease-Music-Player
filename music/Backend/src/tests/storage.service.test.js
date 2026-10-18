jest.mock("@aws-sdk/client-s3", () => ({
    S3Client: jest.fn(() => ({})),
    GetObjectCommand: jest.fn(function (input) { this.input = input; }),
}));
jest.mock("@aws-sdk/s3-request-presigner", () => ({ getSignedUrl: jest.fn() }));

process.env.IMAGEKIT_PRIVATE_KEY = "test-private-key";
process.env.IMAGEKIT_URL_ENDPOINT = "https://ik.imagekit.io/test-account";
process.env.IMAGEKIT_PUBLIC_KEY = "test-public-key";
process.env.AWS_REGION = "ap-south-1";
process.env.AWS_ACCESS_KEY_ID = "test-access";
process.env.AWS_SECRET_ACCESS_KEY = "test-secret";
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { uploadFile, getPreSignerUrl, deleteFile, parseStoredAsset } = require("../services/storage.service");

describe("media storage service", () => {
    beforeEach(() => { jest.restoreAllMocks(); jest.clearAllMocks(); });

    it("uploads a file to ImageKit using a generated name and private file setting", async () => {
        const response = { fileId: "file-123", filePath: "/tunease/audio/generated.mp3" };
        jest.spyOn(global, "fetch").mockResolvedValue({ ok: true, json: async () => response });
        const result = await uploadFile({ buffer: Buffer.from("audio"), mimetype: "audio/mpeg", originalname: "unsafe name.mp3" }, "audio");
        expect(parseStoredAsset(result)).toEqual(response);
        const [url, options] = fetch.mock.calls[0];
        expect(url).toBe("https://upload.imagekit.io/api/v1/files/upload");
        expect(options.method).toBe("POST");
        expect(options.body.get("folder")).toBe("/tunease/audio");
        expect(options.body.get("isPrivateFile")).toBe("true");
        expect(options.body.get("fileName")).toMatch(/^[0-9a-f-]+\.mp3$/);
    });

    it("generates an expiring signed ImageKit delivery URL", async () => {
        const stored = `imagekit:${JSON.stringify({ fileId: "file-123", filePath: "/tunease/audio/a.mp3" })}`;
        const url = await getPreSignerUrl(stored);
        expect(url).toMatch(/^https:\/\/ik\.imagekit\.io\/test-account\/tunease\/audio\/a\.mp3\?ik-t=\d+&ik-s=[a-f0-9]{40}$/);
    });

    it("keeps legacy S3 records signed while migration is pending", async () => {
        getSignedUrl.mockResolvedValue("https://s3.example.test/legacy");
        await expect(getPreSignerUrl("old-key.mp3")).resolves.toBe("https://s3.example.test/legacy");
        expect(GetObjectCommand).toHaveBeenCalledWith({ Bucket: "amzn-s3-tunease-bucket", Key: "old-key.mp3" });
    });

    it("deletes only an ImageKit file by file ID", async () => {
        const stored = `imagekit:${JSON.stringify({ fileId: "file-123", filePath: "/tunease/covers/a.jpg" })}`;
        jest.spyOn(global, "fetch").mockResolvedValue({ ok: true });
        await expect(deleteFile(stored)).resolves.toBe(true);
        expect(fetch).toHaveBeenCalledWith("https://api.imagekit.io/v1/files/file-123", expect.objectContaining({ method: "DELETE" }));
        await expect(deleteFile("old-s3-key")).resolves.toBe(false);
    });

    it("returns an actionable error when ImageKit configuration is missing", async () => {
        const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
        process.env.IMAGEKIT_PRIVATE_KEY = "";
        const aliases = ["IMAGE_KIT_PRIVATEKEY", "IMAGE_KIT_PRIVATE_KEY"];
        const previousAliases = aliases.map((name) => process.env[name]);
        aliases.forEach((name) => { process.env[name] = ""; });
        jest.resetModules();
        const { getPreSignerUrl: withoutConfig } = require("../services/storage.service");
        const validStoredAsset = `imagekit:${JSON.stringify({ fileId: "id", filePath: "/path.mp3" })}`;
        await expect(withoutConfig(validStoredAsset)).rejects.toThrow("Set IMAGEKIT_PRIVATE_KEY");
        process.env.IMAGEKIT_PRIVATE_KEY = privateKey;
        aliases.forEach((name, index) => {
            if (previousAliases[index] === undefined) delete process.env[name];
            else process.env[name] = previousAliases[index];
        });
    });
});
