import { Request, Response } from "express";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import eventModel from "../models/event.model";
import profileModel from "../models/user.model";
import apiResponse from "../utils/apiResponse";
import eventLogModel from "../models/eventlogs.model";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * @desc Create a new Event
 * @route POST /api/v1/events
 */
export const createEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      title,
      description,
      startUtc,
      endUtc,
      createdBy,
      timezone: tz,
      profiles,
    } = req.body;

    if (!title || !startUtc || !endUtc) {
      return apiResponse(res, 400, false, "Missing required fields");
    }

    const event = await eventModel.create({
      title,
      description,
      startUtc,
      endUtc,
      createdBy,
      timezone: tz || "UTC",
      profiles: profiles || [],
    });

    apiResponse(res, 201, true, "Event created successfully", event);
  } catch (error: any) {
    apiResponse(res, 500, false, "Error creating event", {
      error: error.message,
    });
  }
};

/**
 * @desc Get all Events
 * @route GET /api/v1/events
 */
export const getAllEvents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const events = await eventModel
      .find()
      .populate("profiles", "name timezone")
      .populate("createdBy", "name timezone")
      .sort({ startUtc: 1 });

    apiResponse(res, 200, true, "Events fetched successfully", events);
  } catch (error: any) {
    apiResponse(res, 500, false, "Error fetching events", {
      error: error.message,
    });
  }
};

/**
 * @desc Get single Event by ID
 * @route GET /api/v1/events/:eventId
 */
export const getEventById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { eventId } = req.params;
    const event = await eventModel
      .findById(eventId)
      .populate("profiles", "name timezone")
      .populate("createdBy", "name timezone");

    if (!event) {
      return apiResponse(res, 404, false, "Event not found");
    }

    apiResponse(res, 200, true, "Event fetched successfully", event);
  } catch (error: any) {
    apiResponse(res, 500, false, "Error fetching event", {
      error: error.message,
    });
  }
};

/**
 * @desc Update whole Event (PUT)
 * @route PUT /api/v1/events/:eventId
 */

export const updateEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { eventId } = req.params;
    const updateData = req.body;
    const { updatedBy } = req.body; 

    // 1. Fetch the current event
    const existingEvent = await eventModel.findById(eventId);
    if (!existingEvent) {
      return apiResponse(res, 404, false, "Event not found");
    }

    // 2. Store a copy of "before" data
    const beforeData = existingEvent.toObject();

    // 3. Apply updates and save
    Object.assign(existingEvent, updateData);
    await existingEvent.save();

    // 4. Create event log (difference tracking)
    const afterData = existingEvent.toObject();

    await eventLogModel.create({
      eventId: existingEvent._id,
      updatedBy: updatedBy || null,
      before: beforeData,
      after: afterData,
      timestampUtc: dayjs.utc().toDate(),
    });

    apiResponse(res, 200, true, "Event updated successfully", existingEvent);
  } catch (error: any) {
    apiResponse(res, 500, false, "Error updating event", {
      error: error.message,
    });
  }
};

/**
 * @desc Partially update Event (PATCH)
 * @route PATCH /api/v1/events/:eventId
 */
export const patchEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { eventId } = req.params;
    const updateData = req.body;

    const event = await eventModel.findByIdAndUpdate(eventId, updateData, {
      new: true,
    });

    if (!event) {
      return apiResponse(res, 404, false, "Event not found");
    }

    apiResponse(res, 200, true, "Event partially updated", event);
  } catch (error: any) {
    apiResponse(res, 500, false, "Error patching event", {
      error: error.message,
    });
  }
};

/**
 * @desc Delete an Event
 * @route DELETE /api/v1/events/:eventId
 */
export const deleteEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { eventId } = req.params;

    const event = await eventModel.findByIdAndDelete(eventId);

    if (!event) {
      return apiResponse(res, 404, false, "Event not found");
    }

    apiResponse(res, 200, true, "Event deleted successfully", event);
  } catch (error: any) {
    apiResponse(res, 500, false, "Error deleting event", {
      error: error.message,
    });
  }
};

/**
 * @desc Assign Profiles to an Event
 * @route POST /api/v1/events/:eventId/assign
 */
export const assignProfilesToEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { eventId } = req.params;
    const { profileIds } = req.body;

    if (!Array.isArray(profileIds) || profileIds.length === 0) {
      return apiResponse(
        res,
        400,
        false,
        "profileIds must be a non-empty array"
      );
    }

    const event = await eventModel.findById(eventId);
    if (!event) {
      return apiResponse(res, 404, false, "Event not found");
    }

    // Validate all profiles exist
    const validProfiles = await profileModel.find({ _id: { $in: profileIds } });
    if (validProfiles.length !== profileIds.length) {
      return apiResponse(res, 400, false, "Some profiles not found");
    }

    // Merge and remove duplicates
    const updatedProfiles = Array.from(
      new Set([...event.profiles.map(String), ...profileIds])
    );

    event.profiles = updatedProfiles as any;
    await event.save();

    apiResponse(res, 200, true, "Profiles assigned successfully", event);
  } catch (error: any) {
    apiResponse(res, 500, false, "Error assigning profiles", {
      error: error.message,
    });
  }
};

/**
 * @desc Unassign a Profile from an Event
 * @route DELETE /api/v1/events/:eventId/unassign/:profileId
 */
export const unassignProfileFromEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { eventId, profileId } = req.params;

    const event = await eventModel.findById(eventId);
    if (!event) {
      return apiResponse(res, 404, false, "Event not found");
    }

    // Filter out profile
    event.profiles = event.profiles.filter(
      (id: any) => id.toString() !== profileId
    );

    await event.save();

    apiResponse(res, 200, true, "Profile unassigned successfully", event);
  } catch (error: any) {
    apiResponse(res, 500, false, "Error unassigning profile", {
      error: error.message,
    });
  }
};
