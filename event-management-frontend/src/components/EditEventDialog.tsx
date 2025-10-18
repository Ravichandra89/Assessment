// src/components/event/EditEventDialog.tsx
import { useState, useEffect } from "react";

import type { Event } from "../api/event.api";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { updateEvent as updateEventThunk } from "../features/event/eventThunk";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
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
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { format, parse } from "date-fns";
import { toast } from "sonner";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

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

interface EditEventDialogProps {
  event: Event;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditEventDialog = ({
  event,
  open,
  onOpenChange,
}: EditEventDialogProps) => {
  const dispatch = useAppDispatch();
  const profiles = useAppSelector((state) => state.profiles.profiles);

  const [selectedProfiles, setSelectedProfiles] = useState<string[]>(
    event.profiles
  );
  const [selectedTimezone, setSelectedTimezone] = useState(event.eventTimezone);
  const [startDate, setStartDate] = useState<Date>(
    parse(event.startUtc, "yyyy-MM-dd", new Date())
  );
  const [endDate, setEndDate] = useState<Date>(
    parse(event.endUtc, "yyyy-MM-dd", new Date())
  );
  const [startTime, setStartTime] = useState(
    dayjs(event.startUtc).format("HH:mm")
  );
  const [endTime, setEndTime] = useState(dayjs(event.endUtc).format("HH:mm"));

  useEffect(() => {
    if (open) {
      setSelectedProfiles(event.profiles);
      setSelectedTimezone(event.eventTimezone);
      setStartDate(parse(event.startUtc, "yyyy-MM-dd", new Date()));
      setEndDate(parse(event.endUtc, "yyyy-MM-dd", new Date()));
      setStartTime(dayjs(event.startUtc).format("HH:mm"));
      setEndTime(dayjs(event.endUtc).format("HH:mm"));
    }
  }, [open, event]);

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

    const startUtc = dayjs
      .tz(`${format(startDate, "yyyy-MM-dd")} ${startTime}`, selectedTimezone)
      .utc()
      .toISOString();
    const endUtc = dayjs
      .tz(`${format(endDate, "yyyy-MM-dd")} ${endTime}`, selectedTimezone)
      .utc()
      .toISOString();

    if (dayjs(endUtc).isBefore(dayjs(startUtc))) {
      toast.error("End date/time cannot be before start date/time");
      return;
    }

    dispatch(
      updateEventThunk({
        id: event._id,
        payload: {
          profiles: selectedProfiles,
          eventTimezone: selectedTimezone,
          startUtc,
          endUtc,
          title: event.title, // keep original title
        },
      })
    );

    toast.success("Event updated successfully");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
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
            <Label>Timezone</Label>
            <Select
              value={selectedTimezone}
              onValueChange={setSelectedTimezone}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
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
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex-1 justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(startDate, "MMMM d, yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setStartDate(date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
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
                  <Button variant="outline" className="flex-1 justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(endDate, "MMMM d, yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => date && setEndDate(date)}
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

          {/* Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              Update Event
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
