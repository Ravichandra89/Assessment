import axiosClient from "./axiosClient";
import { AxiosError } from "axios";

export interface Profile {
  _id: string;
  name: string;
  timezone: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Event {
  _id: string;
  title: string;
  description?: string;
  timezone: string;
  startDateTime?: string; // optional, depends on mapping
  endDateTime?: string;
  start?: string; // backend returns "start" and "end" instead of "startUtc"
  end?: string;
  profiles?: Profile[];
  createdBy?: Profile;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/** Response shape for /profiles/:id/events */
export interface ProfileEventsResponse {
  profile: Profile;
  events: Event[];
}

/**
 * Error Handling Utility
 */
function handleAxiosError(context: string, error: unknown): never {
  if (error instanceof AxiosError) {
    console.error(
      `Error ${context}:`,
      error.response?.data || error.message
    );
  } else if (error instanceof Error) {
    console.error(`Unexpected error ${context}:`, error.message);
  } else {
    console.error(`Unknown error ${context}:`, error);
  }
  throw error;
}

const ProfileAPI = {
  /** ➕ Create a new profile */
  createProfile: async (
    name: string,
    timezone: string
  ): Promise<ApiResponse<Profile>> => {
    try {
      const res = await axiosClient.post<ApiResponse<Profile>>("/profiles", {
        name,
        timezone,
      });
      return res.data;
    } catch (error) {
      handleAxiosError("creating profile", error);
    }
  },

  /** 📄 Get all profiles */
  getAllProfiles: async (): Promise<ApiResponse<Profile[]>> => {
    try {
      const res = await axiosClient.get<ApiResponse<Profile[]>>("/profiles");
      return res.data;
    } catch (error) {
      handleAxiosError("fetching profiles", error);
    }
  },

  /** 🔍 Get single profile by ID */
  getProfileById: async (profileId: string): Promise<ApiResponse<Profile>> => {
    try {
      const res = await axiosClient.get<ApiResponse<Profile>>(
        `/profiles/${profileId}`
      );
      return res.data;
    } catch (error) {
      handleAxiosError("fetching profile by ID", error);
    }
  },

  /** ✏️ Update profile details */
  updateProfile: async (
    profileId: string,
    payload: Partial<Pick<Profile, "name" | "timezone">>
  ): Promise<ApiResponse<Profile>> => {
    try {
      const res = await axiosClient.put<ApiResponse<Profile>>(
        `/profiles/${profileId}`,
        payload
      );
      return res.data;
    } catch (error) {
      handleAxiosError("updating profile", error);
    }
  },

  /** 📅 Get all events associated with a profile */
  getProfileEvents: async (
    profileId: string
  ): Promise<ApiResponse<ProfileEventsResponse>> => {
    try {
      const res = await axiosClient.get<ApiResponse<ProfileEventsResponse>>(
        `/profiles/${profileId}/events`
      );
      return res.data;
    } catch (error) {
      handleAxiosError("fetching profile events", error);
    }
  },
};

export default ProfileAPI;
