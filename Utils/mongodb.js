import mongoose from "mongoose";

let isConnected = false;

export const ConnectMongoDB = async () => {
  if (isConnected) {
    return; // already connected, skip
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI environment variable is not set");
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    isConnected = db.connections[0].readyState === 1;
    console.log("MongoDB connected successfully");
  } catch (error) {
    isConnected = false;
    console.error("MongoDB connection failed:", error.message);
    throw error; // propagate so callers return 500
  }
};
