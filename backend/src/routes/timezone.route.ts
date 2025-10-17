// routes/timezone.routes.ts
import { Router } from "express";
import {
  getSupportedTimezones,
  getUserTimezone,
  updateUserTimezone,
  convertToTimezone,
} from "../controllers/timezone.controller";

import { validateRequest } from "../middleware/validateRequest";
import {
  updateUserTimezoneSchema,
  convertTimezoneSchema,
} from "../schema/timezone.schema";

const timezoneRouter = Router();

// Timezone utilities
timezoneRouter.get("/timezones", getSupportedTimezones);
timezoneRouter.get("/timezone/:userId", getUserTimezone);
timezoneRouter.patch(
  "/timezone/:userId",
  validateRequest(updateUserTimezoneSchema),
  updateUserTimezone
);
timezoneRouter.post(
  "/timezone/convert",
  validateRequest(convertTimezoneSchema),
  convertToTimezone
);

export default timezoneRouter;
