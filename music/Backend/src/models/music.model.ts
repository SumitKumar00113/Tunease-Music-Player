import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IMusic extends Document {
  title: string;
  description?: string;
  artistName: string;
  artistId: Types.ObjectId;
  album?: Types.ObjectId | null;
  albumName?: string;
  featuredArtists?: string;
  genre?: string;
  coverImageKey: string;
  musicKey: string;
  duration: number;
  releaseDate?: Date;
  playCount: number;
  isPublished: boolean;
  isExplicit: boolean;
  createdBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const musicSchema = new Schema<IMusic>(
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
    artistName: {
      type: String,
      required: true,
    },
    artistId: {
      type: Schema.Types.ObjectId,
      ref: "Artist",
      required: true,
    },
    album: {
      type: Schema.Types.ObjectId,
      ref: "Album",
      default: null,
    },
    albumName: {
      type: String,
      trim: true,
    },
    featuredArtists: {
      type: String,
      trim: true,
    },
    genre: {
      type: String,
      trim: true,
    },
    coverImageKey: {
      type: String,
      required: true,
    },
    musicKey: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
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
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const musicModel: Model<IMusic> = mongoose.models.music || mongoose.model<IMusic>("music", musicSchema);

export default musicModel;
module.exports = musicModel;
