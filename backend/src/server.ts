// server.ts
import dotenv from "dotenv";
import app from "./app";
import colors from "colors";
import connectDB from "./config/db";
import { connectRedis } from "./config/redis";

dotenv.config();

// connecting to Redis
connectRedis().then(() => console.log("Redis ready"));

// Connect to MongoDB
connectDB().then(() => {
  console.log(colors.green("MongoDB connected successfully"));

  const PORT = process.env.PORT || 5000;

  const server = app.listen(PORT, () => {
    console.log(colors.cyan(`🚀 Server running on http://localhost:${PORT}`));
  });

  process.on("unhandledRejection", (err: any) => {
    console.error(colors.red("Unhandled Rejection:"), err);
    server.close(() => process.exit(1));
  });

  // Graceful shutdown on termination signals
  process.on("SIGTERM", () => {
    console.log(colors.yellow("SIGTERM received. Shutting down gracefully..."));
    server.close(() => console.log(colors.green("Process terminated")));
  });
});
