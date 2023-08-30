import mongoose from "mongoose";
import { config } from "@/config/config";

const MONGO_URL = config.mongo.url;

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("🎲 Connected to MongoDB Sucessfull!");
  })
  .catch((err) => {
    console.error("Connection error:", err);
  });

const db = mongoose.connection;

export default db;
