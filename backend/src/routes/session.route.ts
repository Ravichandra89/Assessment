// routes/session.routes.ts
import { Router } from "express";
import {
  setActiveProfiles,
  getActiveProfiles,
} from "../controllers/session.controller";

const sessionRouter = Router();

// Sessions (active profiles)
sessionRouter.post("/session", setActiveProfiles);
sessionRouter.get("/session", getActiveProfiles);

export default sessionRouter;
