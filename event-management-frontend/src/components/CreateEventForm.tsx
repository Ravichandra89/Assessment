// src/components/event/CreateEventForm.tsx
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";

import { Button } from "./ui/button";

import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Calendar } from "./ui/calendar";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Calendar as CalendarIcon, Clock, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "../lib/utils";
import { toast } from "sonner";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { fetchProfiles } from "../features/profiles/profileThunks";
import { createEvent as createEventThunk } from "../features/event/eventThunk";

dayjs.extend(utc);
dayjs.extend(timezone);

const TIMEZONES = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Paris", label: "Paris (CET)" },
  { value: "Asia/Kolkata", label: "India (IST)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Australia/Sydney", label: "Sydney (AEDT)" },
];

export const CreateEventForm = () => {
  const dispatch = useAppDispatch();
  const profiles = useAppSelector((state) => state.profiles.profiles);

  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const [selectedTimezone, setSelectedTimezone] = useState("America/New_York");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("09:00");

  useEffect(() => {
    // fetch profiles when component mounts
    dispatch(fetchProfiles());
  }, [dispatch]);

  const handleProfileToggle = (profileId: string) => {
    setSelectedProfiles((prev) =>
      prev.includes(profileId)
        ? prev.filter((id) => id !== profileId)
        : [...prev, profileId]
    );
  };

  const handleSubmit = () => {
    if (selectedProfiles.length === 0) {
      toast.error("Please select at least one profile");
      return;
    }
    if (!startDate || !endDate) {
      toast.error("Please select start and end dates");
      return;
    }

    const start = dayjs.tz(
      `${format(startDate, "yyyy-MM-dd")} ${startTime}`,
      selectedTimezone
    );
    const end = dayjs.tz(
      `${format(endDate, "yyyy-MM-dd")} ${endTime}`,
      selectedTimezone
    );

    if (end.isBefore(start)) {
      toast.error("End date/time cannot be before start date/time");
      return;
    }

    // dispatch the Redux thunk
    const selectedProfileIds = selectedProfiles; // string[]

    dispatch(
      createEventThunk({
        title: "My Event",
        profiles: selectedProfileIds,
        eventTimezone: selectedTimezone,
        startUtc: dayjs
          .tz(
            `${format(startDate, "yyyy-MM-dd")} ${startTime}`,
            selectedTimezone
          )
          .utc()
          .toISOString(), // convert to UTC
        endUtc: dayjs
          .tz(`${format(endDate, "yyyy-MM-dd")} ${endTime}`, selectedTimezone)
          .utc()
          .toISOString(), // convert to UTC
      })
    );

    // Reset form
    setSelectedProfiles([]);
    setStartDate(undefined);
    setEndDate(undefined);
    setStartTime("09:00");
    setEndTime("09:00");

    toast.success("Event created successfully");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Event</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profiles */}
        <div className="space-y-2">
          <Label>Profiles</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                {selectedProfiles.length > 0
                  ? `${selectedProfiles.length} profile${
                      selectedProfiles.length > 1 ? "s" : ""
                    } selected`
                  : "Select profiles..."}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-3">
              <div className="space-y-2">
                {profiles.map((profile) => (
                  <div
                    key={profile._id}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      checked={selectedProfiles.includes(profile._id)}
                      onChange={() => handleProfileToggle(profile._id)}
                      className="h-4 w-4 rounded border-border"
                    />
                    <label className="text-sm">{profile.name}</label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Timezone */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Timezone
          </Label>

          <Select value={selectedTimezone} onValueChange={setSelectedTimezone}>
            <SelectTrigger className="w-full border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background">
              <SelectValue placeholder="Select timezone..." />
            </SelectTrigger>

            <SelectContent
              className={cn(
                // fallback color protection
                "bg-popover text-popover-foreground border border-border shadow-lg rounded-md",
                "bg-white text-black dark:bg-neutral-900 dark:text-neutral-100"
              )}
            >
              {TIMEZONES.map((tz) => (
                <SelectItem
                  key={tz.value}
                  value={tz.value}
                  className={cn(
                    // fallback color protection for each item
                    "cursor-pointer text-sm px-2 py-1.5 rounded-sm",
                    "focus:bg-accent focus:text-accent-foreground",
                    "hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-neutral-800 dark:hover:text-white",
                    "text-foreground"
                  )}
                >
                  {tz.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Start Date & Time */}
        <div className="space-y-2">
          <Label>Start Date & Time</Label>
          <div className="flex gap-2">
            {/* Date Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "flex-1 justify-start",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-0 bg-card">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => date && setStartDate(date)}
                  initialFocus
                  className="pointer-events-auto bg-white"
                />
              </PopoverContent>
            </Popover>

            {/* Time Picker */}
            <div className="flex items-center gap-2 rounded-lg border bg-input px-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-24 border-0 bg-transparent p-0 focus-visible:ring-0"
              />
            </div>
          </div>
        </div>

        {/* End Date & Time */}
        <div className="space-y-2">
          <Label>End Date & Time</Label>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "flex-1 justify-start",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            <div className="flex items-center gap-2 rounded-lg border bg-input px-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-24 border-0 bg-transparent p-0 focus-visible:ring-0"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button onClick={handleSubmit} className="w-full" size="lg">
          <Plus className="imr-2 h-5 w-5" />
          Create Event
        </Button>
      </CardContent>
    </Card>
  );
};
