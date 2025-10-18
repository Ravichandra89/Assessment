// src/types/event.d.ts

export interface Event {
  _id: string;
  title: string;
  description?: string;
  profiles: string[]; // IDs of assigned profiles
  eventTimezone: string; // IANA timezone string e.g., "Asia/Kolkata"
  startUtc: string; // ISO string in UTC
  endUtc: string; // ISO string in UTC
  createdBy?: string; // User ID who created
  created_at: string; // ISO string in UTC
  updated_at: string; // ISO string in UTC
}

export interface EventLog {
  _id: string;
  eventId: string;
  updatedBy: string;
  before: Record<string, unknown>;
  after: Record<string, unknown>;
  timestampUtc: string; // ISO string in UTC
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
