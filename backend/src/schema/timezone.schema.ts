// schemas/timezone.schema.ts
import { z } from "zod";

// Schema for updating a user's timezone
export const updateUserTimezoneSchema = z.object({
  timezone: z.string().min(1, "Timezone is required"),
});

// Schema for converting a UTC timestamp to a target timezone
export const convertTimezoneSchema = z.object({
  timestampUtc: z.string().min(1, "timestampUtc is required"),
  timezone: z.string().min(1, "Target timezone is required"),
});
