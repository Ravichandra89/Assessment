// src/types/profile.d.ts

export interface Profile {
  _id: string;
  name: string;
  timezone: string; // User-selected timezone, e.g., "Asia/Kolkata"
  created_at: string; // ISO string
  updated_at: string; // ISO string
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Optional: profile events type
import type { Event } from "./event";

export interface ProfileWithEvents extends Profile {
  events: Event[];
}
