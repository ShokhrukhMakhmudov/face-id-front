import mongoose from "mongoose";

const visitSchema = new mongoose.Schema({
  userId: { type: String, ref: "User", required: true },
  timestamp: Date,
  photo: String,
  status: String,
});

const Visit = mongoose.models.Visit || mongoose.model("Visit", visitSchema);

export default Visit;
