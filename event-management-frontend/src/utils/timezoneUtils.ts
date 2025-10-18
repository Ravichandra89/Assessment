import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Get list of all supported timezones for dropdowns
 */
export const getAllTimezones = (): string[] => {
  // Using Intl API for browser-supported timezones
  return Intl.supportedValuesOf("timeZone");
};

/**
 * Get user's current timezone
 */
export const getUserTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

/**
 * Convert a timestamp from one timezone to another
 */
export const convertBetweenTimezones = (
  date: string,
  fromTz: string,
  toTz: string
) => {
  return dayjs.tz(date, fromTz).tz(toTz).format();
};

/**
 * Format timestamp in a specific timezone
 */
export const formatInTimezone = (
  date: string,
  tz: string,
  format = "YYYY-MM-DD HH:mm"
) => {
  return dayjs.tz(date, tz).format(format);
};
