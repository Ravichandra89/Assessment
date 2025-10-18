// server.ts
import dotenv from "dotenv";
import colors from "colors";
import app from "./app";
import connectDB from "./config/db";
import { connectRedis } from "./config/redis";

dotenv.config();

const startServer = async () => {
  try {
    // Connect to Redis
    await connectRedis();
    console.log(colors.green("Redis connection initialized"));

    // Connect to MongoDB
    await connectDB();
    console.log(colors.green("MongoDB connected successfully"));

    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(colors.cyan(`Server running on http://localhost:${PORT}`));
    });

    process.on("unhandledRejection", (err: any) => {
      console.error(colors.red("Unhandled Rejection:"), err);
      server.close(() => process.exit(1));
    });

    process.on("SIGTERM", () => {
      console.log(
        colors.yellow("SIGTERM received. Shutting down gracefully...")
      );
      server.close(() => console.log(colors.green("Process terminated")));
    });
  } catch (err: any) {
    console.error(colors.red("Startup Error:"), err.message);
    process.exit(1);
  }
};

startServer();
