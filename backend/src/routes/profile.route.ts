import { Router } from "express";
import {
  createProfile,
  getAllProfiles,
  getProfileById,
  updateProfile,
  getProfileEvents,
} from "../controllers/profile.controller";
import { validateRequest } from "../middleware/validateRequest";
import {
  createProfileSchema,
  updateProfileSchema,
} from "../schema/profile.schema";

const profileRouter = Router();

profileRouter.post(
  "/profiles",
  validateRequest(createProfileSchema),
  createProfile
);
profileRouter.put(
  "/profiles/:profileId",
  validateRequest(updateProfileSchema),
  updateProfile
);

profileRouter.get("/profiles", getAllProfiles);
profileRouter.get("/profiles/:profileId", getProfileById);
profileRouter.get("/profiles/:profileId/events", getProfileEvents);

export default profileRouter;
