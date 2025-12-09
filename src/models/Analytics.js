import mongoose from "mongoose";

const AnalyticsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  twitterHandle: { type: String, required: true },
  tweetType: { type: String, required: true },
  maxGeneration: { type: Number, required: true },
  ip: { type: String },
  userAgent: { type: String },
  location: { type: String }, // You can store city, country, region
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Analytics", AnalyticsSchema);
