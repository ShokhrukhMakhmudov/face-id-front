"use server";
import mongoose from "mongoose";

const connectMongoDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("MongoDB connected", mongoose.modelNames());
  } catch (error) {
    console.log("Could not connect to MongoDB", error);
  }
};

export default connectMongoDb;
