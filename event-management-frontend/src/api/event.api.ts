import axiosClient from "./axiosClient";

// -------------------------------
// Interfaces
// -------------------------------

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

const EventAPI = {
  /** Create a new event */
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
      console.error("Error creating event:", error);
      throw error;
    }
  },

  /** Fetch all events */
  getAllEvents: async (): Promise<ApiResponse<Event[]>> => {
    try {
      const res = await axiosClient.get<ApiResponse<Event[]>>("/events");
      return res.data;
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
  },

  /** Fetch event by ID */
  getEventById: async (eventId: string): Promise<ApiResponse<Event>> => {
    try {
      const res = await axiosClient.get<ApiResponse<Event>>(
        `/events/${eventId}`
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching event:", error);
      throw error;
    }
  },

  /** Update event (PUT) */
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
      console.error("Error updating event:", error);
      throw error;
    }
  },

  /** Patch event (Partial Update) */
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
      console.error("Error partially updating event:", error);
      throw error;
    }
  },

  /** Delete event */
  deleteEvent: async (eventId: string): Promise<ApiResponse<null>> => {
    try {
      const res = await axiosClient.delete<ApiResponse<null>>(
        `/events/${eventId}`
      );
      return res.data;
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  },

  /** Assign profiles to an event */
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
      console.error("Error assigning profiles:", error);
      throw error;
    }
  },

  /** Unassign profile from event */
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
      console.error("Error unassigning profile:", error);
      throw error;
    }
  },

  /** Fetch event logs */
  getEventLogs: async (eventId: string): Promise<ApiResponse<EventLog[]>> => {
    try {
      const res = await axiosClient.get<ApiResponse<EventLog[]>>(
        `/events/${eventId}/logs`
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching event logs:", error);
      throw error;
    }
  },
};

export default EventAPI;
