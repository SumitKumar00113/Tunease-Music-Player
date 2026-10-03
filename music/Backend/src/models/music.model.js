import mongoose from "mongoose";

const musicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },
artistName:{
  type:String,
  required:true,
},
    artistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artist",
      required: true,
    },

    album: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Album",
      default: null,
    },

    genre: {
      type: String,
      trim: true,
    },

    coverImageKey: {
      type: String,
      required: true,
    },

    musicKey:{
      type: String,
      required: true,
    },

    duration: {
      type: Number, // duration in seconds
      required: true,
    },

    releaseDate: {
      type: Date,
    },

    playCount: {
      type: Number,
      default: 0,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },

    isExplicit: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Music = mongoose.model("Music", musicSchema);

export default Music;