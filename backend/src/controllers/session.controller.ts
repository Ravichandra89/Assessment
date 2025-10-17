// controllers/session.controller.ts
import { Request, Response } from "express";
import apiResponse from "../utils/apiResponse";
import userModel from "../models/user.model"; // Assuming sessions are stored per user

/**
 * POST /api/v1/session
 * Set active profiles for a user
 * Body: { activeProfiles: string[] } -> array of profile IDs
 */
export const setActiveProfiles = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // assuming auth middleware sets req.user
    const { activeProfiles } = req.body;

    if (!Array.isArray(activeProfiles) || activeProfiles.length === 0) {
      return apiResponse(
        res,
        400,
        false,
        "activeProfiles must be a non-empty array"
      );
    }

    const user = await userModel
      .findByIdAndUpdate(userId, { activeProfiles }, { new: true })
      .select("name activeProfiles");

    if (!user) {
      return apiResponse(res, 404, false, "User not found");
    }

    apiResponse(res, 200, true, "Active profiles updated successfully", {
      userId: user._id,
      name: user.name,
      activeProfiles: user.activeProfiles,
    });
  } catch (error: any) {
    apiResponse(res, 500, false, "Error setting active profiles", {
      error: error.message,
    });
  }
};

/**
 * GET /api/v1/session
 * Get currently active profiles for a user
 */
export const getActiveProfiles = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // assuming auth middleware sets req.user

    const user = await userModel.findById(userId).select("name activeProfiles");
    if (!user) {
      return apiResponse(res, 404, false, "User not found");
    }

    apiResponse(res, 200, true, "Active profiles fetched successfully", {
      userId: user._id,
      name: user.name,
      activeProfiles: user.activeProfiles || [],
    });
  } catch (error: any) {
    apiResponse(res, 500, false, "Error fetching active profiles", {
      error: error.message,
    });
  }
};
