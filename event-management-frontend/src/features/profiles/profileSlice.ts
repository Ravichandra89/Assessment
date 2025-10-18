// src/features/profile/profileSlice.ts
import {
  createSlice,
  isPending,
  isRejected,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { Profile, Event } from "../../api/profile.api";
import {
  fetchProfiles,
  createProfile,
  updateProfile,
  fetchProfileEvents,
} from "./profileThunks";

// -------------------------------
// State
// -------------------------------
interface ProfileState {
  profiles: Profile[];
  currentProfile: Profile | null; // renamed
  profileEvents: Event[];
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profiles: [],
  currentProfile: null,
  profileEvents: [],
  loading: false,
  error: null,
};

// -------------------------------
// Slice
// -------------------------------
const profileSlice = createSlice({
  name: "profiles",
  initialState,
  reducers: {
    setCurrentProfile: (state, action: PayloadAction<Profile | null>) => {
      state.currentProfile = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Fulfilled cases
      .addCase(fetchProfiles.fulfilled, (state, action) => {
        state.loading = false;
        state.profiles = action.payload;
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profiles.unshift(action.payload);
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.profiles.findIndex(
          (p) => p._id === action.payload._id
        );
        if (idx !== -1) state.profiles[idx] = action.payload;
      })
      .addCase(fetchProfileEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.profileEvents = action.payload;
      })

      // ✅ Pending matcher
      .addMatcher(isPending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // ✅ Rejected matcher
      .addMatcher(isRejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : action.error.message ?? "Something went wrong";
      });
  },
});

export const { setCurrentProfile, clearError } = profileSlice.actions;
export default profileSlice.reducer;
