import { Router } from "express";
import {
  createProfile,
  getAllProfiles,
  getProfileById,
  updateProfile,
  getProfileEvents,
} from "../controllers/profile.controller";

const router = Router();

router.post("/profiles", createProfile);
router.get("/profiles", getAllProfiles);
router.get("/profiles/:profileId", getProfileById);
router.put("/profiles/:profileId", updateProfile);
router.get("/profiles/:profileId/events", getProfileEvents);

export default router;
