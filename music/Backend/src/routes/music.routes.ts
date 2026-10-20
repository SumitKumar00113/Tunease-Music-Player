import express, { Router, RequestHandler } from "express";
import multer from "multer";
import * as musicMiddleware from "../middleware/auth.middleware";
import * as musicController from "../controllers/music.controller";
import * as spotifyController from "../controllers/spotify.controller";
import { AUDIO_LIMIT } from "../services/media-validation.service";
import { authenticatedRateLimiter, playlistRateLimiter, searchRateLimiter, uploadRateLimiter } from "../middleware/rate-limit.middleware";
import { validatePlaylistBody, validateSearchQuery, validateUploadBody } from "../middleware/request-validation.middleware";

const router: Router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: AUDIO_LIMIT, files: 2, fields: 20 },
});

router.get(
  "/spotify/search",
  musicMiddleware.userValidate as RequestHandler,
  authenticatedRateLimiter,
  searchRateLimiter,
  validateSearchQuery,
  spotifyController.searchSpotifyTracks as RequestHandler
);

router.post(
  "/upload-music",
  musicMiddleware.artistValidate as RequestHandler,
  authenticatedRateLimiter,
  uploadRateLimiter,
  upload.fields([
    {
      name: "music",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  validateUploadBody,
  musicController.uploadMusic as unknown as RequestHandler
);

router.get("/all", musicController.getAllMusic as unknown as RequestHandler);
router.get("/artist-music/:id", musicController.getArtistMusic as unknown as RequestHandler);
router.delete("/:id", musicMiddleware.artistValidate as RequestHandler, authenticatedRateLimiter, musicController.deleteMusic as unknown as RequestHandler);

router.post(
  "/create-playlist/:id",
  musicMiddleware.userValidate as RequestHandler,
  authenticatedRateLimiter,
  playlistRateLimiter,
  validatePlaylistBody,
  musicController.createPlaylist as unknown as RequestHandler
);
router.get(
  "/get-playlist",
  musicMiddleware.userValidate as RequestHandler,
  authenticatedRateLimiter,
  musicController.getPlaylist as unknown as RequestHandler
);

router.get(
  "/playlist/:id",
  musicMiddleware.userValidate as RequestHandler,
  authenticatedRateLimiter,
  musicController.getPlaylistById as unknown as RequestHandler
);
router.delete(
  "/playlist/:id",
  musicMiddleware.userValidate as RequestHandler,
  authenticatedRateLimiter,
  playlistRateLimiter,
  musicController.deletePlaylist as unknown as RequestHandler
);
router.get(
  "/playlist/:playlistId/music",
  musicMiddleware.userValidate as RequestHandler,
  authenticatedRateLimiter,
  musicController.getMusicFromPlaylist as unknown as RequestHandler
);
router.delete(
  "/playlist/:playlistId/music/:musicId",
  musicMiddleware.userValidate as RequestHandler,
  authenticatedRateLimiter,
  playlistRateLimiter,
  musicController.deleteMusicFromPlaylist as unknown as RequestHandler
);

export default router;
module.exports = router;
