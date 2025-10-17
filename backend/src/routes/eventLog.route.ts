// routes/eventLog.routes.ts
import { Router } from "express";
import {
  getEventLogs,
  getEventLogById,
} from "../controllers/eventLog.controller";

const eventLogRouter = Router();

// Event Logs
eventLogRouter.get("/events/:eventId/logs", getEventLogs);
eventLogRouter.get("/events/:eventId/logs/:logId", getEventLogById);

export default eventLogRouter;
