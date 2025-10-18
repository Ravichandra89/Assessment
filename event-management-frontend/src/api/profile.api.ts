// src/api/profile.api.ts
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
  startDateTime: string;
  endDateTime: string;
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

// Profile API
const ProfileAPI = {
  /** Create a new profile */
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
    } catch (error: unknown) {
      handleAxiosError("creating profile", error);
    }
  },

  /** Get all profiles */
  getAllProfiles: async (): Promise<ApiResponse<Profile[]>> => {
    try {
      const res = await axiosClient.get<ApiResponse<Profile[]>>("/profiles");
      return res.data;
    } catch (error: unknown) {
      handleAxiosError("fetching profiles", error);
    }
  },

  /** Get profile by ID */
  getProfileById: async (profileId: string): Promise<ApiResponse<Profile>> => {
    try {
      const res = await axiosClient.get<ApiResponse<Profile>>(
        `/profiles/${profileId}`
      );
      return res.data;
    } catch (error: unknown) {
      handleAxiosError("fetching profile by ID", error);
    }
  },

  /** Update profile details */
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
    } catch (error: unknown) {
      handleAxiosError("updating profile", error);
    }
  },

  /** Get all events associated with a profile */
  getProfileEvents: async (
    profileId: string
  ): Promise<ApiResponse<Event[]>> => {
    try {
      const res = await axiosClient.get<ApiResponse<Event[]>>(
        `/profiles/${profileId}/events`
      );
      return res.data;
    } catch (error: unknown) {
      handleAxiosError("fetching profile events", error);
    }
  },
};

export default ProfileAPI;
