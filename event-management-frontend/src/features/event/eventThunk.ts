import { createAsyncThunk } from "@reduxjs/toolkit";
import EventAPI from "../../api/event.api";
import type { Event, EventLog } from "../../types/event";

// Helper to convert snake_case from API to camelCase
const mapEvent = (e: any): Event => ({
  ...e,
  createdAt: e.created_at,
  updatedAt: e.updated_at,
});

const mapEventLog = (log: any): EventLog => ({
  ...log,
  createdAt: log.created_at,
  updatedAt: log.updated_at,
});

export const fetchEvents = createAsyncThunk<
  Event[],
  void,
  { rejectValue: string }
>("events/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const res = await EventAPI.getAllEvents();
    return res.data.map(mapEvent);
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Failed to fetch events"
    );
  }
});

export const createEvent = createAsyncThunk<
  Event,
  Omit<Event, "_id" | "createdAt" | "updatedAt" | "createdBy">,
  { rejectValue: string }
>("events/create", async (payload, { rejectWithValue }) => {
  try {
    const res = await EventAPI.createEvent(payload);
    return mapEvent(res.data);
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Failed to create event"
    );
  }
});

export const updateEvent = createAsyncThunk<
  Event,
  { id: string; payload: Partial<Event> },
  { rejectValue: string }
>("events/update", async ({ id, payload }, { rejectWithValue }) => {
  try {
    const res = await EventAPI.updateEvent(id, payload);
    return mapEvent(res.data);
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Failed to update event"
    );
  }
});

export const deleteEvent = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("events/delete", async (eventId, { rejectWithValue }) => {
  try {
    await EventAPI.deleteEvent(eventId);
    return eventId;
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Failed to delete event"
    );
  }
});

export const fetchEventLogs = createAsyncThunk<
  EventLog[],
  string,
  { rejectValue: string }
>("events/fetchLogs", async (eventId, { rejectWithValue }) => {
  try {
    const res = await EventAPI.getEventLogs(eventId);
    return res.data.map(mapEventLog);
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Failed to fetch event logs"
    );
  }
});
