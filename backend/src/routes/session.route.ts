// routes/session.routes.ts
import { Router } from "express";
import {
  setActiveProfiles,
  getActiveProfiles,
} from "../controllers/session.controller";

const router = Router();

// Sessions (active profiles)
router.post("/session", setActiveProfiles);
router.get("/session", getActiveProfiles);

export default router;
