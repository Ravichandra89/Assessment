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

const router = Router();

// Event CRUD
router.post("/events", createEvent);
router.get("/events", getAllEvents);
router.get("/events/:eventId", getEventById);
router.put("/events/:eventId", updateEvent);
router.patch("/events/:eventId", patchEvent);
router.delete("/events/:eventId", deleteEvent);

// Assign / Unassign Profiles
router.post("/events/:eventId/assign", assignProfilesToEvent);
router.delete("/events/:eventId/unassign/:profileId", unassignProfileFromEvent);

export default router;
