import { Request, Response } from "express";

import eventLogModel from "../models/eventlogs.model";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import apiResponse from "../utils/apiResponse";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * GET /api/v1/events/:eventId/logs
 * Fetch all update logs for a given event.
 */
export const getEventLogs = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { eventId } = req.params;
    const { userTimezone } = req.query; // optional: ?userTimezone=Asia/Kolkata

    const logs = await eventLogModel
      .find({ eventId })
      .populate("updatedBy", "name timezone")
      .sort({ timestampUtc: -1 });

    // If timezone is provided, convert UTC timestamps to user timezone
    const formattedLogs = userTimezone
      ? logs.map((log) => ({
          ...log.toObject(),
          timestampLocal: dayjs
            .utc(log.timestampUtc)
            .tz(String(userTimezone))
            .format(),
        }))
      : logs;

    apiResponse(
      res,
      200,
      true,
      "Event logs fetched successfully",
      formattedLogs
    );
  } catch (error: any) {
    apiResponse(res, 500, false, "Error fetching event logs", {
      error: error.message,
    });
  }
};

/**
 * GET /api/v1/events/:eventId/logs/:logId
 * Fetch a single log entry for an event.
 */
export const getEventLogById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { eventId, logId } = req.params;
    const { userTimezone } = req.query;

    const log = await eventLogModel
      .findOne({ _id: logId, eventId })
      .populate("updatedBy", "name timezone");

    if (!log) {
      return apiResponse(res, 404, false, "Log entry not found");
    }

    // Convert timestamp to user timezone if passed
    const response = userTimezone
      ? {
          ...log.toObject(),
          timestampLocal: dayjs
            .utc(log.timestampUtc)
            .tz(String(userTimezone))
            .format(),
        }
      : log;

    apiResponse(res, 200, true, "Log entry fetched successfully", response);
  } catch (error: any) {
    apiResponse(res, 500, false, "Error fetching log entry", {
      error: error.message,
    });
  }
};
