import mongoose from "mongoose";
import _config from "../config/config";

const connectToDb = async (): Promise<void> => {
  try {
    if (_config.MONGO_URI) {
      await mongoose.connect(_config.MONGO_URI);
      console.log("connected to Database");
    } else {
      console.warn("MONGO_URI not set, skipping database connection");
    }
  } catch (err: unknown) {
    console.log("error during connect to Database", err);
  }
};

export default connectToDb;
module.exports = connectToDb;
