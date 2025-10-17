// schemas/event.schema.ts
import { z } from "zod";
import dayjs from "dayjs";

export const createEventSchema = z
  .object({
    title: z.string().min(1, "Event title is required"),
    description: z.string().optional(),
    profiles: z
      .array(z.string().min(1))
      .nonempty("At least one profile must be assigned"),
    timezone: z.string().min(1, "Timezone is required"),
    startDateTime: z.string().min(1, "Start date/time is required"),
    endDateTime: z.string().min(1, "End date/time is required"),
  })
  .refine(
    (data: { startDateTime: string; endDateTime: string }) =>
      dayjs(data.endDateTime).isAfter(dayjs(data.startDateTime)),
    {
      message: "End date/time must be after start date/time",
      path: ["endDateTime"],
    }
  );

export const updateEventSchema = z
  .object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    profiles: z.array(z.string().min(1)).optional(),
    timezone: z.string().optional(),
    startDateTime: z.string().optional(),
    endDateTime: z.string().optional(),
  })
  .refine(
    (data: { startDateTime?: string; endDateTime?: string }) => {
      if (data.startDateTime && data.endDateTime) {
        return dayjs(data.endDateTime).isAfter(dayjs(data.startDateTime));
      }
      return true;
    },
    {
      message: "End date/time must be after start date/time",
      path: ["endDateTime"],
    }
  );
