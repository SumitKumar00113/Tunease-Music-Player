jest.mock("../services/storage.service", () => ({
    uploadFile: jest.fn(),
    getPreSignerUrl: jest.fn(),
}));

jest.mock("../models/music.model", () => jest.fn());

const { uploadFile, getPreSignerUrl } = require("../services/storage.service");
const musicModel = require("../models/music.model");
const {
    uploadMusic,
    getArtistMusic,
} = require("../controllers/music.controller");

const createResponse = () => {
    const res = {
        status: jest.fn(),
        json: jest.fn(),
    };
    res.status.mockReturnValue(res);
    res.json.mockReturnValue(res);
    return res;
};

const artist = {
    _id: "artist-123",
    fullName: {
        firstName: "Taylor",
        lastName: "Reed",
    },
};

beforeEach(() => {
    jest.clearAllMocks();
    musicModel.create = jest.fn();
});

describe("uploadMusic", () => {
    const musicFile = {
        originalname: "track.mp3",
        mimetype: "audio/mpeg",
        buffer: Buffer.from("ID3audio"),
        size: 8,
    };
    const coverImageFile = {
        originalname: "cover.jpg",
        mimetype: "image/jpeg",
        buffer: Buffer.from([0xff, 0xd8, 0xff, 0xd9]),
        size: 4,
    };
    const request = () => ({
        req: {
            files: {
                music: [musicFile],
                coverImage: [coverImageFile],
            },
            body: {
                title: "Test Track",
                description: "A test track",
                genre: "Pop",
                duration: "185",
            },
            user: artist,
        },
        res: createResponse(),
    });

    it("uploads audio and cover separately, saves track metadata, and returns the track", async () => {
        uploadFile
            .mockResolvedValueOnce("audio-key")
            .mockResolvedValueOnce("cover-key");
        getPreSignerUrl
            .mockResolvedValueOnce("https://example.test/audio")
            .mockResolvedValueOnce("https://example.test/cover");
        musicModel.create.mockImplementation(async (data) => ({
            _id: "track-123",
            ...data,
        }));
        const { req, res } = request();

        await uploadMusic(req, res);

        expect(uploadFile).toHaveBeenNthCalledWith(1, musicFile, "audio");
        expect(uploadFile).toHaveBeenNthCalledWith(2, coverImageFile, "covers");
        expect(getPreSignerUrl).toHaveBeenNthCalledWith(1, "audio-key");
        expect(getPreSignerUrl).toHaveBeenNthCalledWith(2, "cover-key");
        expect(musicModel.create).toHaveBeenCalledWith(expect.objectContaining({
            title: "Test Track",
            artistName: "Taylor Reed",
            artistId: artist._id,
            createdBy: artist._id,
            musicKey: "audio-key",
            coverImageKey: "cover-key",
            duration: 185,
        }));
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: "music created",
            music: expect.objectContaining({
                _id: "track-123",
                musicUrl: "https://example.test/audio",
                coverImageUrl: "https://example.test/cover",
            }),
        }));
    });

    it("rejects the upload if either file is missing", async () => {
        const { req, res } = request();
        delete req.files.coverImage;

        await uploadMusic(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(uploadFile).not.toHaveBeenCalled();
        expect(musicModel).not.toHaveBeenCalled();
    });

    it("rejects the upload when no authenticated artist is attached", async () => {
        const { req, res } = request();
        delete req.user;

        await uploadMusic(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(uploadFile).not.toHaveBeenCalled();
    });

    it("returns an error response if an asset upload fails", async () => {
        uploadFile.mockRejectedValue(new Error("S3 unavailable"));
        const { req, res } = request();

        await uploadMusic(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: "Media upload failed. Check the ImageKit configuration and try again.",
        }));
    });

    it("rejects invalid file contents before calling ImageKit", async () => {
        const { req, res } = request();
        req.files.music[0].buffer = Buffer.from("not audio");
        await uploadMusic(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(uploadFile).not.toHaveBeenCalled();
    });
});

describe("getArtistMusic", () => {
    it("returns artist tracks with signed audio and cover URLs", async () => {
        const tracks = [
            {
                _id: "track-123",
                artistId: artist._id,
                musicKey: "audio-key",
                coverImageKey: "cover-key",
            },
        ];
        musicModel.find = jest.fn().mockReturnValue({
            lean: jest.fn().mockResolvedValue(tracks),
        });
        getPreSignerUrl
            .mockResolvedValueOnce("https://example.test/audio")
            .mockResolvedValueOnce("https://example.test/cover");
        const res = createResponse();

        await getArtistMusic({ params: { id: artist._id } }, res);

        expect(musicModel.find).toHaveBeenCalledWith({ artistId: artist._id });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "artist music fetched",
            music: [{
                ...tracks[0],
                musicUrl: "https://example.test/audio",
                coverImageUrl: "https://example.test/cover",
            }],
        });
    });

    it("returns an error response if listing tracks fails", async () => {
        musicModel.find = jest.fn().mockReturnValue({
            lean: jest.fn().mockRejectedValue(new Error("Database unavailable")),
        });
        const res = createResponse();

        await getArtistMusic({ params: { id: artist._id } }, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: "internal server error",
        }));
    });
});
