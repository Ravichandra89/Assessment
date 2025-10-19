// src/types/event.d.ts

// Event entity
export interface Event {
  _id: string;
  title: string;
  description?: string;
  profiles: string[]; // IDs of assigned profiles
  eventTimezone: string; // IANA timezone string
  startUtc: string; // ISO string in UTC
  endUtc: string; // ISO string in UTC
  createdBy?: string; // User ID who created the event
  createdAt: string; // ISO string in UTC (camelCase)
  updatedAt: string; // ISO string in UTC (camelCase)
}

// Event log entity
export interface EventLog {
  _id: string;
  eventId: string;
  updatedBy: string; // User ID who updated
  before: Record<string, unknown>; // Snapshot before update
  field?: string;
  after: Record<string, unknown>; // Snapshot after update
  timestampUtc: string; // ISO string in UTC
  createdAt: string; // ISO string in UTC (camelCase)
  updatedAt: string; // ISO string in UTC (camelCase)
}

// Generic API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
