import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IPlaylist extends Document {
  playListName: string;
  artistName: string;
  artistId: Types.ObjectId;
  createdBy: Types.ObjectId;
  songs: Types.ObjectId[];
  isPublic: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const playlistSchema = new Schema<IPlaylist>(
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
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    songs: [
      {
        type: Schema.Types.ObjectId,
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

export const playlistModel: Model<IPlaylist> =
  mongoose.models.playlist || mongoose.model<IPlaylist>("playlist", playlistSchema);

export default playlistModel;
module.exports = playlistModel;
