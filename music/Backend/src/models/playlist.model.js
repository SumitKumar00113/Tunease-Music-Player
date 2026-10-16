const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema(
  {
    playListName: {
      type: String,
      required: true,
      trim: true,
    },
artistName: {
  type: String,
  required: true,
},  
    artistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
   
    songs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "music",
      },
    ],

    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const playlistModel = mongoose.model("playlist", playlistSchema);

module.exports = playlistModel;