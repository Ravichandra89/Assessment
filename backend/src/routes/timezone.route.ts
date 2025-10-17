// routes/timezone.routes.ts
import { Router } from "express";
import {
  getSupportedTimezones,
  getUserTimezone,
  updateUserTimezone,
  convertToTimezone,
} from "../controllers/timezone.controller";

const router = Router();

// Timezone utilities
router.get("/timezones", getSupportedTimezones);
router.get("/timezone/:userId", getUserTimezone);
router.patch("/timezone/:userId", updateUserTimezone);
router.post("/timezone/convert", convertToTimezone);

export default router;
