import { Response } from "express";
import { Types } from "mongoose";
import { uploadFile, getPreSignerUrl, deleteFile } from "../services/storage.service";
import musicModel from "../models/music.model";
import playlistModel from "../models/playlist.model";
import cacheService from "../redis/cache.service";
import { validateMediaFile, UploadedFileLike } from "../services/media-validation.service";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

interface MulterFiles {
  music?: Express.Multer.File[];
  coverImage?: Express.Multer.File[];
}

export interface PopulatedSong {
  _id?: unknown;
  musicKey?: string;
  coverImageKey?: string;
  [key: string]: unknown;
}

const safeGetUrl = async (key?: string): Promise<string> => {
  if (!key) return "";
  try {
    return await getPreSignerUrl(key);
  } catch (e: unknown) {
    const name = e instanceof Error ? e.name : "Error";
    console.warn("Could not generate media delivery URL:", name);
    return "";
  }
};

export const uploadMusic = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  const files = req.files as MulterFiles | undefined;
  const musicFile = files?.music?.[0];
  const coverImageFile = files?.coverImage?.[0];

  if (!musicFile || !coverImageFile) {
    return res.status(400).json({
      message: "Music and cover image files are required",
    });
  }

  const audioValidationError = validateMediaFile(musicFile as UploadedFileLike, "audio");
  const coverValidationError = validateMediaFile(coverImageFile as UploadedFileLike, "cover");
  if (audioValidationError || coverValidationError) {
    return res.status(400).json({ message: audioValidationError || coverValidationError });
  }

  const user = req.user;
  if (!user) {
    return res.status(401).json({
      message: "Authentication is required",
    });
  }
  const userId = user.id || user._id;

  try {
    const { title, description, genre, duration, artistName, albumName, featuredArtists, releaseDate } = req.body;
    const musicKey = await uploadFile(musicFile, "audio");
    const coverImageKey = await uploadFile(coverImageFile, "covers");

    const computedArtistName =
      artistName ||
      (user.fullName
        ? typeof user.fullName === "string"
          ? user.fullName
          : `${user.fullName.firstName || ""} ${user.fullName.lastName || ""}`.trim()
        : "Artist");

    const savedMusic = await musicModel.create({
      title,
      description,
      artistName: computedArtistName,
      artistId: userId,
      album: userId,
      albumName: albumName || "",
      featuredArtists: featuredArtists || "",
      genre: genre || "Pop",
      musicKey,
      coverImageKey,
      duration: Number(duration) || 180,
      releaseDate: releaseDate ? new Date(releaseDate) : new Date(),
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

    const musicObj = typeof savedMusic.toObject === "function" ? savedMusic.toObject() : savedMusic;

    return res.status(201).json({
      message: "music created",
      music: {
        ...musicObj,
        musicUrl,
        coverImageUrl,
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "provider error";
    console.error("Music upload failed:", errorMsg);
    return res.status(500).json({
      message: "Media upload failed. Check the ImageKit configuration and try again.",
    });
  }
};

export const getAllMusic = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const cacheKey = "music:all";

    // 1. Try reading from Redis cache
    const cachedMusic = await cacheService.get(cacheKey);
    if (cachedMusic) {
      return res.status(200).json({
        message: "All music fetched successfully",
        music: cachedMusic,
        source: "cache",
      });
    }

    // 2. Cache miss: fetch from MongoDB and resolve presigned URLs
    const musicDocs = await musicModel.find({ isPublished: true }).sort({ createdAt: -1 }).lean();

    const musicWithUrls = await Promise.all(
      musicDocs.map(async (music) => {
        const musicUrl = await safeGetUrl(music.musicKey);
        const coverImageUrl = await safeGetUrl(music.coverImageKey);
        return {
          ...music,
          musicUrl,
          coverImageUrl,
        };
      })
    );

    // 3. Cache in Redis with 15 minutes TTL (900s)
    await cacheService.set(cacheKey, musicWithUrls, cacheService.EXPIRATION.ALL_MUSIC);

    return res.status(200).json({
      message: "All music fetched successfully",
      music: musicWithUrls,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return res.status(500).json({
      message: "Internal server error",
      error: message,
    });
  }
};

export const getArtistMusic = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
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
    const musicDocs = await musicModel.find({ artistId }).lean();

    const musicWithUrls = await Promise.all(
      musicDocs.map(async (music) => ({
        ...music,
        musicUrl: await getPreSignerUrl(music.musicKey),
        coverImageUrl: await getPreSignerUrl(music.coverImageKey),
      }))
    );

    // 3. Store in Redis with 15 minutes TTL (900s)
    await cacheService.set(cacheKey, musicWithUrls, cacheService.EXPIRATION.ARTIST_MUSIC);

    return res.status(200).json({
      message: "artist music fetched",
      music: musicWithUrls,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return res.status(500).json({
      message: "internal server error",
      error: message,
    });
  }
};

export const createPlaylist = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const userId = user.id || user._id;
    const { playListName } = req.body;
    const musicId = req.params.id;

    const music = await musicModel.findById(musicId);
    if (!music) {
      return res.status(404).json({ message: "Music not found" });
    }

    const existingPlaylist = await playlistModel.findOne({
      playListName,
      artistId: music.artistId,
      createdBy: userId,
    });

    if (existingPlaylist) {
      if (existingPlaylist.songs.some((sId) => String(sId) === String(music._id))) {
        return res.status(400).json({
          message: "Music already exists in this playlist",
        });
      }

      existingPlaylist.songs.push(music._id as unknown as Types.ObjectId);
      await existingPlaylist.save();

      await cacheService.del(`playlist:user:${userId}`);
      await cacheService.del(`playlist:${existingPlaylist._id}`);
      await cacheService.del(`playlist:music:${existingPlaylist._id}:${userId}`);

      return res.status(200).json({
        message: "Music added to existing playlist",
        playlist: existingPlaylist,
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

    await cacheService.del(`playlist:user:${userId}`);

    return res.status(201).json({
      message: "Playlist created successfully",
      playlist: newPlaylist,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return res.status(500).json({
      message: "Internal server error",
      error: message,
    });
  }
};

export const getPlaylist = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id || req.user?._id;
    const cacheKey = `playlist:user:${userId}`;

    const cachedPlaylists = await cacheService.get(cacheKey);
    if (cachedPlaylists) {
      return res.status(200).json({
        message: "Playlists fetched successfully",
        playlists: cachedPlaylists,
        source: "cache",
      });
    }

    const playlists = await playlistModel
      .find({ createdBy: userId })
      .populate("songs")
      .lean();

    const playlistsWithUrls = await Promise.all(
      playlists.map(async (playlist) => {
        const rawSongs = Array.isArray(playlist.songs) ? playlist.songs : [];
        const songsWithUrls = await Promise.all(
          rawSongs.map(async (song) => {
            const typedSong = song as unknown as PopulatedSong;
            return {
              ...typedSong,
              musicUrl: await getPreSignerUrl(typedSong.musicKey || ""),
              coverImageUrl: await getPreSignerUrl(typedSong.coverImageKey || ""),
            };
          })
        );

        return {
          ...playlist,
          songs: songsWithUrls,
        };
      })
    );

    await cacheService.set(cacheKey, playlistsWithUrls, cacheService.EXPIRATION.USER_PLAYLISTS);

    return res.status(200).json({
      message: "Playlists fetched successfully",
      playlists: playlistsWithUrls,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return res.status(500).json({
      message: "Internal server error",
      error: message,
    });
  }
};

export const getPlaylistById = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id || req.user?._id;
    const playlistId = req.params.id;
    const cacheKey = `playlist:${playlistId}`;

    const cachedPlaylist = await cacheService.get(cacheKey);
    if (cachedPlaylist) {
      return res.status(200).json({
        message: "playlist fetch successfully",
        playlist: cachedPlaylist,
        source: "cache",
      });
    }

    const playlist = await playlistModel
      .findOne({ _id: playlistId, createdBy: userId })
      .populate("songs")
      .lean();

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    await cacheService.set(cacheKey, playlist, cacheService.EXPIRATION.PLAYLIST_DETAIL);

    return res.status(200).json({
      message: "playlist fetch successfully",
      playlist,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return res.status(500).json({
      message: "Internal server error",
      error: message,
    });
  }
};

export const deletePlaylist = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const playlistId = req.params.id;
    const userId = req.user?.id || req.user?._id;
    const deletedPlaylist = await playlistModel.findOneAndDelete({
      _id: playlistId,
      createdBy: userId,
    });

    if (!deletedPlaylist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    await cacheService.del(`playlist:user:${userId}`);
    await cacheService.del(`playlist:${playlistId}`);
    await cacheService.del(`playlist:music:${playlistId}:${userId}`);

    return res.status(200).json({
      message: "Playlist deleted successfully",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return res.status(500).json({
      message: "Internal server error",
      error: message,
    });
  }
};

export const deleteMusicFromPlaylist = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const playlistId = req.params.playlistId;
    const musicId = req.params.musicId;
    const userId = req.user?.id || req.user?._id;
    const result = await playlistModel.updateOne(
      { _id: playlistId, createdBy: userId },
      { $pull: { songs: musicId as unknown as Types.ObjectId } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    await cacheService.del(`playlist:user:${userId}`);
    await cacheService.del(`playlist:${playlistId}`);
    await cacheService.del(`playlist:music:${playlistId}:${userId}`);

    return res.status(200).json({
      message: "Music deleted from playlist successfully",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return res.status(500).json({
      message: "Internal server error",
      error: message,
    });
  }
};

export const getMusicFromPlaylist = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const playlistId = req.params.playlistId;
    const userId = req.user?.id || req.user?._id;
    const cacheKey = `playlist:music:${playlistId}:${userId}`;

    const cachedData = await cacheService.get(cacheKey);
    if (cachedData) {
      return res.status(200).json({
        message: "Playlist fetched successfully",
        playlist: cachedData,
        source: "cache",
      });
    }

    const playlist = await playlistModel
      .findOne({ _id: playlistId, createdBy: userId })
      .populate("songs")
      .lean();

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    const rawSongs = Array.isArray(playlist.songs) ? playlist.songs : [];
    const songsWithUrls = await Promise.all(
      rawSongs.map(async (song) => {
        const typedSong = song as unknown as PopulatedSong;
        return {
          ...typedSong,
          musicUrl: await getPreSignerUrl(typedSong.musicKey || ""),
          coverImageUrl: await getPreSignerUrl(typedSong.coverImageKey || ""),
        };
      })
    );

    const playlistWithUrls = {
      ...playlist,
      songs: songsWithUrls,
    };

    await cacheService.set(cacheKey, playlistWithUrls, cacheService.EXPIRATION.PLAYLIST_MUSIC);

    return res.status(200).json({
      message: "Playlist fetched successfully",
      playlist: playlistWithUrls,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return res.status(500).json({
      message: "Internal server error",
      error: message,
    });
  }
};

export const deleteMusic = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const musicId = req.params.id;
    const userId = req.user?.id || req.user?._id;

    const musicToDelete = await musicModel.findOne({ _id: musicId, createdBy: userId });
    if (!musicToDelete) {
      return res.status(404).json({
        message: "Music not found or unauthorized",
      });
    }

    await musicModel.deleteOne({ _id: musicId, createdBy: userId });

    const cleanupResults = await Promise.allSettled([
      deleteFile(musicToDelete.musicKey),
      deleteFile(musicToDelete.coverImageKey),
    ]);
    if (cleanupResults.some((result) => result.status === "rejected")) {
      console.warn("Track removed but ImageKit media cleanup needs attention.");
    }

    await cacheService.del("music:all");
    await cacheService.del(`music:artist:${userId}`);
    await cacheService.delPattern("playlist:*");

    return res.status(200).json({
      message: cleanupResults.some((result) => result.status === "rejected")
        ? "Music deleted; media cleanup could not be completed."
        : "Music deleted successfully",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return res.status(500).json({
      message: "Internal server error",
      error: message,
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
  deleteMusic,
};
