import mongoose from "mongoose";

// Схема для сотрудников
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  sectionId: {
    type: String,
    ref: "Section",
    required: true,
  },
  photo: { type: String, required: true },
});

export default mongoose.models?.User || mongoose.model("User", userSchema);
