// routes/eventLog.routes.ts
import { Router } from "express";
import {
  getEventLogs,
  getEventLogById,
} from "../controllers/eventLog.controller";

const router = Router();

// Event Logs
router.get("/events/:eventId/logs", getEventLogs);
router.get("/events/:eventId/logs/:logId", getEventLogById);

export default router;
