// src/api/event.api.ts
import axiosClient from "./axiosClient";
import { AxiosError } from "axios";

export interface Event {
  _id: string;
  title: string;
  description?: string;
  profiles: string[];
  eventTimezone: string;
  startUtc: string;
  endUtc: string;
  createdBy?: string;
  created_at: string;
  updated_at: string;
}

export interface EventLog {
  _id: string;
  eventId: string;
  updatedBy: string;
  before: Record<string, unknown>;
  after: Record<string, unknown>;
  timestampUtc: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Error Handling Utility
 */
function handleAxiosError(context: string, error: unknown): never {
  if (error instanceof AxiosError) {
    console.error(
      `❌ Error ${context}:`,
      error.response?.data || error.message
    );
  } else if (error instanceof Error) {
    console.error(`❌ Unexpected error ${context}:`, error.message);
  } else {
    console.error(`❌ Unknown error ${context}:`, error);
  }
  throw error;
}

const EventAPI = {
  /** ➕ Create a new event */
  createEvent: async (
    payload: Omit<Event, "_id" | "created_at" | "updated_at" | "createdBy">
  ): Promise<ApiResponse<Event>> => {
    try {
      const res = await axiosClient.post<ApiResponse<Event>>(
        "/events",
        payload
      );
      return res.data;
    } catch (error) {
      handleAxiosError("creating event", error);
    }
  },

  /** 📄 Fetch all events */
  getAllEvents: async (): Promise<ApiResponse<Event[]>> => {
    try {
      const res = await axiosClient.get<ApiResponse<Event[]>>("/events");
      return res.data;
    } catch (error) {
      handleAxiosError("fetching events", error);
    }
  },

  /** 🔍 Fetch event by ID */
  getEventById: async (eventId: string): Promise<ApiResponse<Event>> => {
    try {
      const res = await axiosClient.get<ApiResponse<Event>>(
        `/events/${eventId}`
      );
      return res.data;
    } catch (error) {
      handleAxiosError("fetching event by ID", error);
    }
  },

  /** ✏️ Update event (PUT) */
  updateEvent: async (
    eventId: string,
    payload: Partial<Event>
  ): Promise<ApiResponse<Event>> => {
    try {
      const res = await axiosClient.put<ApiResponse<Event>>(
        `/events/${eventId}`,
        payload
      );
      return res.data;
    } catch (error) {
      handleAxiosError("updating event", error);
    }
  },

  /** 🩹 Partially update event (PATCH) */
  patchEvent: async (
    eventId: string,
    payload: Partial<Event>
  ): Promise<ApiResponse<Event>> => {
    try {
      const res = await axiosClient.patch<ApiResponse<Event>>(
        `/events/${eventId}`,
        payload
      );
      return res.data;
    } catch (error) {
      handleAxiosError("patching event", error);
    }
  },

  /** ❌ Delete event */
  deleteEvent: async (eventId: string): Promise<ApiResponse<null>> => {
    try {
      const res = await axiosClient.delete<ApiResponse<null>>(
        `/events/${eventId}`
      );
      return res.data;
    } catch (error) {
      handleAxiosError("deleting event", error);
    }
  },

  /** 👥 Assign profiles to event */
  assignProfiles: async (
    eventId: string,
    profiles: string[]
  ): Promise<ApiResponse<Event>> => {
    try {
      const res = await axiosClient.post<ApiResponse<Event>>(
        `/events/${eventId}/assign`,
        { profiles }
      );
      return res.data;
    } catch (error) {
      handleAxiosError("assigning profiles", error);
    }
  },

  /** 🧹 Unassign profile from event */
  unassignProfile: async (
    eventId: string,
    profileId: string
  ): Promise<ApiResponse<Event>> => {
    try {
      const res = await axiosClient.delete<ApiResponse<Event>>(
        `/events/${eventId}/unassign/${profileId}`
      );
      return res.data;
    } catch (error) {
      handleAxiosError("unassigning profile", error);
    }
  },

  /** 🪵 Fetch event logs */
  getEventLogs: async (eventId: string): Promise<ApiResponse<EventLog[]>> => {
    try {
      const res = await axiosClient.get<ApiResponse<EventLog[]>>(
        `/events/${eventId}/logs`
      );
      return res.data;
    } catch (error) {
      handleAxiosError("fetching event logs", error);
    }
  },
};

export default EventAPI;
