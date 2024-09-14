import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in the environment variables");
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected successfully");
  } catch (error) {
    console.error("DB connection error:");
  }
};