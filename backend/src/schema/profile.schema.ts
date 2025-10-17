// schemas/profile.schema.ts
import { z } from "zod";

// Schema for creating a profile
export const createProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  timezone: z.string().optional(), // optional; can validate against allowed timezones if needed
});

// Schema for updating a profile
export const updateProfileSchema = z.object({
  name: z.string().min(1, "Name cannot be empty").optional(),
  timezone: z.string().optional(),
});
