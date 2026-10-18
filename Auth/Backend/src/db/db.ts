import mongoose from "mongoose";
import _config from "../config/config";

const connectToDb = async (): Promise<void> => {
  try {
    if (!_config.MONGO_URI) {
      console.warn("MONGO_URI is not set in config");
      return;
    }
    await mongoose.connect(_config.MONGO_URI);
    console.log("connected to Database");
  } catch (err) {
    console.log("error during connect to Database", err);
  }
};

export default connectToDb;
module.exports = connectToDb;
