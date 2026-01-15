import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
  longUrl: { type: String, required: true },
  shortId: { type: String, required: true, unique: true },
  clicks: { type: Number, default: 0 },
  lastAccessed: { type: Date },
  createdAt: { type: Date, default: Date.now },
  metadata: {
    alias: { type: String },
    customDomain: { type: String }
  }
});

export default mongoose.model("URL", urlSchema);
