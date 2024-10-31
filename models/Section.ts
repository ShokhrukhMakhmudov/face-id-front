import mongoose from "mongoose";

const SectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

export default mongoose.models.Section ||
  mongoose.model("Section", SectionSchema);
