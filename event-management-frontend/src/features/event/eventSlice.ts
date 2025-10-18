// src/features/event/eventSlice.ts
import {
  createSlice,
  type PayloadAction,
  isPending,
  isRejected,
} from "@reduxjs/toolkit";
import type { Event, EventLog } from "../../api/event.api";
import {
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  fetchEventLogs,
} from "./eventThunk";

interface EventState {
  events: Event[];
  selectedEvent: Event | null;
  eventLogs: Record<string, EventLog[]>; // logs keyed by event ID
  loading: boolean;
  error: string | null;
}

const initialState: EventState = {
  events: [],
  selectedEvent: null,
  eventLogs: {}, // initialize empty
  loading: false,
  error: null,
};

const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setSelectedEvent: (state, action: PayloadAction<Event | null>) => {
      state.selectedEvent = action.payload;
    },
    clearEventError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fulfilled cases
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events.unshift(action.payload);
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.events.findIndex((e) => e._id === action.payload._id);
        if (idx !== -1) state.events[idx] = action.payload;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events = state.events.filter((e) => e._id !== action.payload);
      })
      // NEW: Fetch event logs fulfilled
      .addCase(fetchEventLogs.fulfilled, (state, action) => {
        state.loading = false;
        const eventId = action.meta.arg;
        state.eventLogs[eventId] = action.payload;
      })

      // Matchers for pending/rejected
      .addMatcher(isPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(isRejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : action.error.message ?? "Something went wrong";
      });
  },
});

export const { setSelectedEvent, clearEventError } = eventSlice.actions;
export default eventSlice.reducer;
