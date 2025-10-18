import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);


export const convertUtcToUserTz = (utcDate: string, userTimezone: string) => {
  return dayjs.utc(utcDate).tz(userTimezone);
};

/**
 * Convert a local date string to UTC (for API storage)
 */
export const convertLocalToUtc = (localDate: string, userTimezone: string) => {
  return dayjs.tz(localDate, userTimezone).utc().toISOString();
};

/**
 * Format a date to readable string in user's timezone
 */
export const formatDate = (
  date: string | dayjs.Dayjs,
  formatString = "YYYY-MM-DD HH:mm"
) => {
  return dayjs(date).format(formatString);
};

/**
 * Validate that end date is not before start date
 */
export const isValidEventRange = (start: string, end: string) => {
  return dayjs(end).isAfter(dayjs(start)) || dayjs(end).isSame(dayjs(start));
};
