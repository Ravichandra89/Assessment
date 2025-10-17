// app.ts
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import connectDB from "./config/db";

// Import Routers
import profileRouter from "./routes/profile.route";
import eventRouter from "./routes/event.route";
import eventLogRouter from "./routes/eventLog.route";
import timezoneRouter from "./routes/timezone.route";
import sessionRouter from "./routes/session.route";

const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use("/api/v1", profileRouter);
app.use("/api/v1", eventRouter);
app.use("/api/v1", eventLogRouter);
app.use("/api/v1", timezoneRouter);
app.use("/api/v1", sessionRouter);

// Default route
app.get("/", (_req: Request, res: Response) => {
  res.send("Event Management System API is running");
});

// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;
