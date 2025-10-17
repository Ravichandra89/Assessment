// controllers/timezone.controller.ts
import { Request, Response } from "express";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import apiResponse from "../utils/apiResponse";
import userModel from "../models/user.model"; // assuming you have a User model

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Type-safe way to get all supported IANA timezones using Day.js.
 * Since TypeScript types for Day.js timezone plugin don't include 'names',
 * we cast to 'any' here.
 */
const getAllTimezones = (): string[] => {
  return (dayjs.tz as any).names() || [];
};

// GET /api/v1/timezones
export const getSupportedTimezones = (_req: Request, res: Response) => {
  const timezones = getAllTimezones();
  apiResponse(
    res,
    200,
    true,
    "Supported timezones fetched successfully",
    timezones
  );
};

// GET /api/v1/timezone/:userId
export const getUserTimezone = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await userModel.findById(userId).select("name timezone");
    if (!user) {
      return apiResponse(res, 404, false, "User not found");
    }

    apiResponse(res, 200, true, "User timezone fetched successfully", {
      userId: user._id,
      name: user.name,
      timezone: user.timezone || "UTC",
    });
  } catch (error: any) {
    apiResponse(res, 500, false, "Error fetching user timezone", {
      error: error.message,
    });
  }
};

// PATCH /api/v1/timezone/:userId
export const updateUserTimezone = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { timezone: newTimezone } = req.body;

    if (!newTimezone || !getAllTimezones().includes(newTimezone)) {
      return apiResponse(res, 400, false, "Invalid timezone provided");
    }

    const user = await userModel
      .findByIdAndUpdate(userId, { timezone: newTimezone }, { new: true })
      .select("name timezone");

    if (!user) {
      return apiResponse(res, 404, false, "User not found");
    }

    apiResponse(res, 200, true, "User timezone updated successfully", {
      userId: user._id,
      name: user.name,
      timezone: user.timezone,
    });
  } catch (error: any) {
    apiResponse(res, 500, false, "Error updating user timezone", {
      error: error.message,
    });
  }
};

// POST /api/v1/timezone/convert
export const convertToTimezone = (req: Request, res: Response) => {
  try {
    const { timestampUtc, timezone: targetTimezone } = req.body;

    if (!timestampUtc || !targetTimezone) {
      return apiResponse(
        res,
        400,
        false,
        "timestampUtc and timezone are required"
      );
    }

    if (!getAllTimezones().includes(targetTimezone)) {
      return apiResponse(res, 400, false, "Invalid timezone provided");
    }

    const converted = dayjs.utc(timestampUtc).tz(targetTimezone).format();

    apiResponse(res, 200, true, "Timestamp converted successfully", {
      original: timestampUtc,
      converted,
      timezone: targetTimezone,
    });
  } catch (error: any) {
    apiResponse(res, 500, false, "Error converting timestamp", {
      error: error.message,
    });
  }
};
