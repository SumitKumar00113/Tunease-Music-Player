const express=require('express');
const multer=require("multer");
const musicMiddleware=require("../middleware/auth.middleware");
const musicController=require("../controllers/music.controller");
const spotifyController=require("../controllers/spotify.controller");
const { AUDIO_LIMIT } = require("../services/media-validation.service");



const router=express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: AUDIO_LIMIT, files: 2, fields: 20 },
});

router.get(
  "/spotify/search",
  musicMiddleware.userValidate,
  spotifyController.searchSpotifyTracks
);


router.post(
  "/upload-music",
  musicMiddleware.artistValidate,
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
  musicController.uploadMusic
);
router.get(
  "/all",
  musicController.getAllMusic
);
router.get(
  "/artist-music/:id",
  musicController.getArtistMusic
);
router.delete(
  "/:id",
  musicMiddleware.artistValidate,
  musicController.deleteMusic
);
router.post(
  "/create-playlist/:id",
  musicMiddleware.userValidate,
  musicController.createPlaylist
);
router.get(
  "/get-playlist",
  musicMiddleware.userValidate,
  musicController.getPlaylist
);

router.get(
  "/playlist/:id",
  musicMiddleware.userValidate,
  musicController.getPlaylistById
);
router.delete(
  "/playlist/:id",
  musicMiddleware.userValidate,
  musicController.deletePlaylist
);
router.get(
  "/playlist/:playlistId/music",
  musicMiddleware.userValidate,
  musicController.getMusicFromPlaylist
);
router.delete(
  "/playlist/:playlistId/music/:musicId",
  musicMiddleware.userValidate,
  musicController.deleteMusicFromPlaylist
);

module.exports=router;
