import { Request, Response } from "express";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import profileModel from "../models/user.model";
import eventModel from "../models/event.model";
import apiResponse from "../utils/apiResponse";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Create a new profile
 */
export const createProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, timezone: tz } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return apiResponse(res, 400, false, "Invalid name provided");
    }

    const newProfile = new profileModel({
      name: name.trim(),
      timezone: (tz && String(tz)) || "UTC",
    });

    await newProfile.save();

    apiResponse(res, 201, true, "Profile created successfully", newProfile);
  } catch (error) {
    console.error("Error creating profile: ", error);
    apiResponse(res, 500, false, "Internal Server Error");
  }
};

/**
 * Get all profiles
 */
export const getAllProfiles = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const profiles = await profileModel.find().sort({ createdAt: -1 });
    apiResponse(res, 200, true, "Profiles fetched successfully", profiles);
  } catch (error: any) {
    apiResponse(res, 500, false, "Error fetching profiles", {
      error: error.message,
    });
  }
};

/**
 * Get profile by ID
 */
export const getProfileById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { profileId } = req.params;

    if (!profileId)
      return apiResponse(res, 400, false, "profileId param is required");

    const profile = await profileModel.findById(profileId);
    if (!profile) return apiResponse(res, 404, false, "Profile not found");

    apiResponse(res, 200, true, "Profile fetched successfully", profile);
  } catch (error: any) {
    apiResponse(res, 500, false, "Error fetching profile", {
      error: error.message,
    });
  }
};

/**
 * Update profile by ID
 */
export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { profileId } = req.params;
    const { name, timezone: tz } = req.body;

    if (!profileId)
      return apiResponse(res, 400, false, "profileId param is required");

    const updatePayload: Record<string, any> = {};
    if (typeof name === "string" && name.trim())
      updatePayload.name = name.trim();
    if (typeof tz === "string" && tz.trim()) updatePayload.timezone = tz.trim();

    const updated = await profileModel.findByIdAndUpdate(
      profileId,
      updatePayload,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updated) return apiResponse(res, 404, false, "Profile not found");

    apiResponse(res, 200, true, "Profile updated successfully", updated);
  } catch (error: any) {
    apiResponse(res, 500, false, "Error updating profile", {
      error: error.message,
    });
  }
};

/**
 * Get all events assigned to a profile
 */
export const getProfileEvents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { profileId } = req.params;
    if (!profileId)
      return apiResponse(res, 400, false, "profileId param is required");

    const profile = await profileModel.findById(profileId);
    if (!profile) return apiResponse(res, 404, false, "Profile not found");

    const userTz = profile.timezone || "UTC";

    const events = await eventModel
      .find({ profiles: profileId })
      .populate("profiles", "name timezone")
      .populate("createdBy", "name timezone")
      .sort({ startUtc: 1 });

    const formattedEvents = events.map((ev) => {
      const obj = ev.toObject ? ev.toObject() : ev;

      return {
        id: obj._id,
        title: obj.title,
        description: obj.description || "",
        start: obj.startUtc
          ? dayjs.utc(obj.startUtc).tz(userTz).toDate()
          : null,
        end: obj.endUtc ? dayjs.utc(obj.endUtc).tz(userTz).toDate() : null,
        timezone: userTz,
        createdBy: obj.createdBy || null,
        profiles: obj.profiles || [],
        createdAtLocal: obj.createdAt
          ? dayjs.utc(obj.createdAt).tz(userTz).format()
          : null,
        updatedAtLocal: obj.updatedAt
          ? dayjs.utc(obj.updatedAt).tz(userTz).format()
          : null,
      };
    });

    apiResponse(res, 200, true, "Events for profile fetched successfully", {
      profile: {
        _id: profile._id,
        name: profile.name,
        timezone: profile.timezone,
      },
      events: formattedEvents,
    });
  } catch (error: any) {
    apiResponse(res, 500, false, "Error fetching profile events", {
      error: error.message,
    });
  }
};
