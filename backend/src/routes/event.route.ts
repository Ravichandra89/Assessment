// routes/event.routes.ts
import { Router } from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  patchEvent,
  deleteEvent,
  assignProfilesToEvent,
  unassignProfileFromEvent,
} from "../controllers/event.controller";

import { validateRequest } from "../middleware/validateRequest";
import { createEventSchema, updateEventSchema } from "../schema/event.schema";

const eventRouter = Router();

// Event CRUD
eventRouter.post("/events", validateRequest(createEventSchema), createEvent);
eventRouter.get("/events", getAllEvents);
eventRouter.get("/events/:eventId", getEventById);
eventRouter.put(
  "/events/:eventId",
  validateRequest(updateEventSchema),
  updateEvent
);
eventRouter.patch("/events/:eventId", patchEvent);
eventRouter.delete("/events/:eventId", deleteEvent);

// Assign / Unassign Profiles
eventRouter.post("/events/:eventId/assign", assignProfilesToEvent);
eventRouter.delete(
  "/events/:eventId/unassign/:profileId",
  unassignProfileFromEvent
);

export default eventRouter;
