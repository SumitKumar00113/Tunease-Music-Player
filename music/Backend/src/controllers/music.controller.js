const { uploadFile, getPreSignerUrl } = require("../services/storage.service");
const musicModel = require("../models/music.model");
const playlistModel = require("../models/playlist.model");
const cacheService = require("../redis/cache.service");

const safeGetUrl = async (key) => {
    if (!key) return "";
    try {
        return await getPreSignerUrl(key);
    } catch (e) {
        console.warn("Could not get presigned URL for key:", key, e.message);
        return key;
    }
};

const uploadMusic = async (req, res) => {
    const musicFile = req.files?.music?.[0];
    const coverImageFile = req.files?.coverImage?.[0];

    if (!musicFile || !coverImageFile) {
        return res.status(400).json({
            message: "Music and cover image files are required",
        });
    }

    const user = req.user;
    if (!user) {
        return res.status(401).json({
            message: "Authentication is required",
        });
    }
    const userId = user.id || user._id;

    try {
        const { title, description, genre, duration, artistName } = req.body;
        const musicKey = await uploadFile(musicFile);
        const coverImageKey = await uploadFile(coverImageFile);

        const computedArtistName = artistName || (user.fullName
            ? (typeof user.fullName === 'string' ? user.fullName : `${user.fullName.firstName || ''} ${user.fullName.lastName || ''}`.trim())
            : 'Artist');

        const savedMusic = await musicModel.create({
            title,
            description,
            artistName: computedArtistName,
            artistId: userId,
            album: userId,
            genre: genre || "Pop",
            musicKey,
            coverImageKey,
            duration: Number(duration) || 180,
            releaseDate: Date.now(),
            playCount: 0,
            isPublished: true,
            isExplicit: false,
            createdBy: userId,
        });

        const musicUrl = await safeGetUrl(musicKey);
        const coverImageUrl = await safeGetUrl(coverImageKey);

        // Invalidate all-music cache and artist cache
        await cacheService.del("music:all");
        await cacheService.del(`music:artist:${userId}`);

        return res.status(201).json({
            message: "music created",
            music: {
                ...(savedMusic.toObject ? savedMusic.toObject() : savedMusic),
                musicUrl,
                coverImageUrl,
            },
        });
    } catch (err) {
        return res.status(500).json({
            message: "internal server error",
            error: err.message,
        });
    }
};

const getAllMusic = async (req, res) => {
    try {
        const cacheKey = "music:all";

        // 1. Try reading from Redis cache
        const cachedMusic = await cacheService.get(cacheKey);
        if (cachedMusic) {
            return res.status(200).json({
                message: "All music fetched successfully",
                music: cachedMusic,
                source: "cache"
            });
        }

        // 2. Cache miss: fetch from MongoDB and resolve presigned URLs
        const musicDocs = await musicModel.find({ isPublished: true }).sort({ createdAt: -1 }).lean();

        const musicWithUrls = await Promise.all(musicDocs.map(async (music) => {
            const musicUrl = await safeGetUrl(music.musicKey);
            const coverImageUrl = await safeGetUrl(music.coverImageKey);
            return {
                ...music,
                musicUrl,
                coverImageUrl,
            };
        }));

        // 3. Cache in Redis with 15 minutes TTL (900s)
        await cacheService.set(cacheKey, musicWithUrls, cacheService.EXPIRATION.ALL_MUSIC);

        return res.status(200).json({
            message: "All music fetched successfully",
            music: musicWithUrls,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error",
            error: err.message,
        });
    }
};

const getArtistMusic = async (req, res) => {
    try {
        const artistId = req.params.id;
        const cacheKey = `music:artist:${artistId}`;

        // 1. Try reading from Redis cache
        const cachedArtistMusic = await cacheService.get(cacheKey);
        if (cachedArtistMusic) {
            return res.status(200).json({
                message: "artist music fetched",
                music: cachedArtistMusic,
            });
        }

        // 2. Cache miss: query DB
        const musicDocs = await musicModel.find({
            artistId,
        }).lean();

        const musicWithUrls = await Promise.all(musicDocs.map(async (music) => ({
            ...music,
            musicUrl: await getPreSignerUrl(music.musicKey),
            coverImageUrl: await getPreSignerUrl(music.coverImageKey),
        })));

        // 3. Store in Redis with 15 minutes TTL (900s)
        await cacheService.set(cacheKey, musicWithUrls, cacheService.EXPIRATION.ARTIST_MUSIC);

        return res.status(200).json({
            message: "artist music fetched",
            music: musicWithUrls,
        });
    } catch (err) {
        return res.status(500).json({
            message: "internal server error",
            error: err,
        });
    }
};

const createPlaylist = async (req, res) => {
    try {
        const user = req.user;
        const userId = user.id || user._id;
        const { playListName } = req.body;
        const musicId = req.params.id;

        const music = await musicModel.findById(musicId);

        if (!music) {
            return res.status(404).json({
                message: "Music not found"
            });
        }

        // Check whether playlist already exists
        const existingPlaylist = await playlistModel.findOne({
            playListName,
            artistId: music.artistId,
            createdBy: userId
        });

        if (existingPlaylist) {
            // Prevent duplicate song
            if (existingPlaylist.songs.includes(music._id)) {
                return res.status(400).json({
                    message: "Music already exists in this playlist"
                });
            }

            existingPlaylist.songs.push(music._id);
            await existingPlaylist.save();

            // Invalidate user playlist caches
            await cacheService.del(`playlist:user:${userId}`);
            await cacheService.del(`playlist:${existingPlaylist._id}`);
            await cacheService.del(`playlist:music:${existingPlaylist._id}:${userId}`);

            return res.status(200).json({
                message: "Music added to existing playlist",
                playlist: existingPlaylist
            });
        }

        const newPlaylist = await playlistModel.create({
            playListName,
            artistName: music.artistName,
            artistId: music.artistId,
            songs: [music._id],
            isPublic: false,
            createdBy: userId,
        });

        // Invalidate user playlists cache
        await cacheService.del(`playlist:user:${userId}`);

        return res.status(201).json({
            message: "Playlist created successfully",
            playlist: newPlaylist
        });

    } catch (err) {
        return res.status(500).json({
            message: "Internal server error",
            error: err.message,
        });
    }
};

const getPlaylist = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const cacheKey = `playlist:user:${userId}`;

        // 1. Check Redis cache
        const cachedPlaylists = await cacheService.get(cacheKey);
        if (cachedPlaylists) {
            return res.status(200).json({
                message: "Playlists fetched successfully",
                playlists: cachedPlaylists,
                source: "cache"
            });
        }

        // 2. Cache miss: query DB
        const playlists = await playlistModel.find({
            createdBy: userId,
        }).populate('songs').lean();

        const playlistsWithUrls = await Promise.all(playlists.map(async (playlist) => {
            const songsWithUrls = await Promise.all(playlist.songs.map(async (song) => ({
                ...song,
                musicUrl: await getPreSignerUrl(song.musicKey),
                coverImageUrl: await getPreSignerUrl(song.coverImageKey),
            })));

            return {
                ...playlist,
                songs: songsWithUrls
            };
        }));

        // 3. Cache in Redis with 10 minutes TTL (600s)
        await cacheService.set(cacheKey, playlistsWithUrls, cacheService.EXPIRATION.USER_PLAYLISTS);

        return res.status(200).json({
            message: "Playlists fetched successfully",
            playlists: playlistsWithUrls,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error",
            error: err.message,
        });
    }
};

const getPlaylistById = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const playlistId = req.params.id;
        const cacheKey = `playlist:${playlistId}`;

        // 1. Check Redis cache
        const cachedPlaylist = await cacheService.get(cacheKey);
        if (cachedPlaylist) {
            return res.status(200).json({
                message: "playlist fetch successfully",
                playlist: cachedPlaylist,
                source: "cache"
            });
        }

        // 2. Cache miss: query DB
        const playlist = await playlistModel.findOne({
            _id: playlistId,
            createdBy: userId,
        }).populate('songs').lean();

        if (!playlist) {
            return res.status(404).json({
                message: "Playlist not found",
            });
        }

        // 3. Cache in Redis with 10 minutes TTL (600s)
        await cacheService.set(cacheKey, playlist, cacheService.EXPIRATION.PLAYLIST_DETAIL);

        return res.status(200).json({
            message: "playlist fetch successfully",
            playlist
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error",
            error: err.message,
        });
    }
};

const deletePlaylist = async (req, res) => {
    try {
        const playlistId = req.params.id;
        const userId = req.user.id || req.user._id;
        const deletedPlaylist = await playlistModel.findOneAndDelete({
            _id: playlistId,
            createdBy: userId,
        });

        if (!deletedPlaylist) {
            return res.status(404).json({
                message: "Playlist not found",
            });
        }

        // Invalidate playlist caches
        await cacheService.del(`playlist:user:${userId}`);
        await cacheService.del(`playlist:${playlistId}`);
        await cacheService.del(`playlist:music:${playlistId}:${userId}`);

        return res.status(200).json({
            message: "Playlist deleted successfully",
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error",
            error: err.message,
        });
    }
};

const deleteMusicFromPlaylist = async (req, res) => {
    try {
        const playlistId = req.params.playlistId;
        const musicId = req.params.musicId;
        const userId = req.user.id || req.user._id;
        const result = await playlistModel.updateOne(
            { _id: playlistId, createdBy: userId },
            { $pull: { songs: musicId } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: "Playlist not found",
            });
        }

        // Invalidate playlist caches
        await cacheService.del(`playlist:user:${userId}`);
        await cacheService.del(`playlist:${playlistId}`);
        await cacheService.del(`playlist:music:${playlistId}:${userId}`);

        return res.status(200).json({
            message: "Music deleted from playlist successfully",
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error",
            error: err.message,
        });
    }
};

const getMusicFromPlaylist = async (req, res) => {
    try {
        const playlistId = req.params.playlistId;
        const userId = req.user.id || req.user._id;
        const cacheKey = `playlist:music:${playlistId}:${userId}`;

        // 1. Check Redis cache
        const cachedData = await cacheService.get(cacheKey);
        if (cachedData) {
            return res.status(200).json({
                message: "Playlist fetched successfully",
                playlist: cachedData,
                source: "cache"
            });
        }

        // 2. Cache miss: query DB
        const playlist = await playlistModel
            .findOne({ _id: playlistId, createdBy: userId })
            .populate("songs")
            .lean();

        if (!playlist) {
            return res.status(404).json({
                message: "Playlist not found",
            });
        }

        const songsWithUrls = await Promise.all(
            playlist.songs.map(async (song) => ({
                ...song,
                musicUrl: await getPreSignerUrl(song.musicKey),
                coverImageUrl: await getPreSignerUrl(song.coverImageKey),
            }))
        );

        const playlistWithUrls = {
            ...playlist,
            songs: songsWithUrls,
        };

        // 3. Cache in Redis with 10 minutes TTL (600s)
        await cacheService.set(cacheKey, playlistWithUrls, cacheService.EXPIRATION.PLAYLIST_MUSIC);

        return res.status(200).json({
            message: "Playlist fetched successfully",
            playlist: playlistWithUrls,
        });

    } catch (err) {
        return res.status(500).json({
            message: "Internal server error",
            error: err.message,
        });
    }
};

const deleteMusic = async (req, res) => {
    try {
        const musicId = req.params.id;
        const userId = req.user.id || req.user._id;

        const deletedMusic = await musicModel.findOneAndDelete({
            _id: musicId,
            createdBy: userId,
        });

        if (!deletedMusic) {
            return res.status(404).json({
                message: "Music not found or unauthorized",
            });
        }

        // Invalidate music caches & patterns
        await cacheService.del("music:all");
        await cacheService.del(`music:artist:${userId}`);
        await cacheService.delPattern("playlist:*");

        return res.status(200).json({
            message: "Music deleted successfully",
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error",
            error: err.message,
        });
    }
};

module.exports = {
    uploadMusic,
    getAllMusic,
    getArtistMusic,
    createPlaylist,
    getPlaylist,
    getPlaylistById,
    deletePlaylist,
    deleteMusicFromPlaylist,
    getMusicFromPlaylist,
    deleteMusic
};