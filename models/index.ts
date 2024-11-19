import mongoose from "mongoose";
import bcrypt from "bcrypt";

const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, "Неверный формат email"],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
});

AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

AdminSchema.methods.comparePassword = function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

const SectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const Section =
  mongoose.models.Section || mongoose.model("Section", SectionSchema);

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

const User = mongoose.models.User || mongoose.model("User", userSchema);

const visitSchema = new mongoose.Schema({
  userId: { type: String, ref: "User", required: true },
  timestamp: Date,
  photo: String,
  status: String,
});

const Visit = mongoose.models.Visit || mongoose.model("Visit", visitSchema);

export { Admin, Section, User, Visit };
