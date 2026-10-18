const { AUDIO_LIMIT, COVER_LIMIT, validateMediaFile } = require("../services/media-validation.service");

describe("media upload validation", () => {
    it("accepts supported audio and cover formats", () => {
        expect(validateMediaFile({ originalname: "song.mp3", mimetype: "audio/mpeg", buffer: Buffer.from("ID3abc"), size: 6 }, "audio")).toBeNull();
        expect(validateMediaFile({ originalname: "cover.webp", mimetype: "image/webp", buffer: Buffer.from("RIFF0000WEBP"), size: 12 }, "cover")).toBeNull();
    });

    it("enforces lower server-side size limits", () => {
        expect(AUDIO_LIMIT).toBe(20 * 1024 * 1024);
        expect(COVER_LIMIT).toBe(5 * 1024 * 1024);
        expect(validateMediaFile({ originalname: "song.mp3", mimetype: "audio/mpeg", buffer: Buffer.from("ID3abc"), size: AUDIO_LIMIT + 1 }, "audio")).toMatch(/20 MiB/);
        expect(validateMediaFile({ originalname: "cover.png", mimetype: "image/png", buffer: Buffer.from([137,80,78,71,13,10,26,10]), size: COVER_LIMIT + 1 }, "cover")).toMatch(/5 MiB/);
    });

    it("rejects unsupported types, mismatched MIME types, and invalid content", () => {
        expect(validateMediaFile({ originalname: "song.ogg", mimetype: "audio/ogg", buffer: Buffer.from("OggS") }, "audio")).toMatch(/MP3, WAV, or FLAC/);
        expect(validateMediaFile({ originalname: "song.mp3", mimetype: "image/jpeg", buffer: Buffer.from("ID3abc") }, "audio")).toMatch(/does not match/);
        expect(validateMediaFile({ originalname: "cover.jpg", mimetype: "image/jpeg", buffer: Buffer.from("not image") }, "cover")).toMatch(/does not match/);
    });
});
