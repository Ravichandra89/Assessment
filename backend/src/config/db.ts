import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

if (!MONGO_URI) {
  throw new Error("MONGO_URI not found in environment variables");
}

const connectDB = async (): Promise<void> => {
  try {
    mongoose.set("strictQuery", true);

    // Directly connect using full URI (includes DB name)
    const conn = await mongoose.connect(MONGO_URI);

    console.log(`MongoDB connected: ${conn.connection.name}`);
    console.log(`📍 Host: ${conn.connection.host}`);
  } catch (error: any) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

// Graceful shutdown on app termination
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed due to app termination");
  process.exit(0);
});

export default connectDB;
