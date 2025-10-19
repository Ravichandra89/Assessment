import { createAsyncThunk } from "@reduxjs/toolkit";
import ProfileAPI from "../../api/profile.api";
import type { Event, Profile, ApiResponse } from "../../api/profile.api";

// -------------------------------
// Fetch all profiles
// -------------------------------
export const fetchProfiles = createAsyncThunk<
  Profile[],
  void,
  { rejectValue: string }
>("profiles/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const res: ApiResponse<Profile[]> = await ProfileAPI.getAllProfiles();
    return res.data;
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Failed to fetch profiles"
    );
  }
});

// -------------------------------
// Create a new profile
// -------------------------------
export const createProfile = createAsyncThunk<
  Profile,
  { name: string; timezone: string },
  { rejectValue: string }
>("profiles/create", async ({ name, timezone }, { rejectWithValue }) => {
  try {
    const res: ApiResponse<Profile> = await ProfileAPI.createProfile(
      name,
      timezone
    );
    return res.data;
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Failed to create profile"
    );
  }
});

// -------------------------------
// Update an existing profile
// -------------------------------
export const updateProfile = createAsyncThunk<
  Profile,
  { id: string; payload: Partial<Pick<Profile, "name" | "timezone">> },
  { rejectValue: string }
>("profiles/update", async ({ id, payload }, { rejectWithValue }) => {
  try {
    const res: ApiResponse<Profile> = await ProfileAPI.updateProfile(
      id,
      payload
    );
    return res.data;
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Failed to update profile"
    );
  }
});

// -------------------------------
// Fetch events linked to a specific profile
// -------------------------------
interface ProfileEventsResponse {
  events: Event[];
}

export const fetchProfileEvents = createAsyncThunk<
  Event[],
  string,
  { rejectValue: string }
>("profiles/fetchEvents", async (profileId, { rejectWithValue }) => {
  try {
    const res: ApiResponse<ProfileEventsResponse> =
      await ProfileAPI.getProfileEvents(profileId);
    return res.data.events;
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Failed to fetch profile events"
    );
  }
});
