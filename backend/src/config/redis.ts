// config/redis.ts
import { createClient } from "redis";

const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

const redisClient = createClient({
  url: REDIS_URL,
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));
redisClient.on("connect", () => console.log("✅ Redis connected"));

export const connectRedis = async () => {
  if (!redisClient.isOpen) await redisClient.connect();
};

export default redisClient;
