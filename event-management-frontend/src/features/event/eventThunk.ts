// src/features/event/eventThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import EventAPI from "../../api/event.api";
import type { Event } from "../../api/event.api";
import type { EventLog } from "../../types/event";

export const fetchEvents = createAsyncThunk<
  Event[],
  void,
  { rejectValue: string }
>("events/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const res = await EventAPI.getAllEvents();
    return res.data;
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Failed to fetch events"
    );
  }
});

// eventThunk.ts
export const createEvent = createAsyncThunk<
  Event,
  Omit<Event, "_id" | "created_at" | "updated_at" | "createdBy">, // correct omitted fields
  { rejectValue: string }
>("events/create", async (payload, { rejectWithValue }) => {
  try {
    const res = await EventAPI.createEvent(payload);
    return res.data;
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
    return res.data;
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
    return res.data;
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Failed to fetch event logs"
    );
  }
});
