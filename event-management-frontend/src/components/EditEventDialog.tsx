import { useState, useEffect } from "react";
import type { Event } from "../types/event";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { updateEvent as updateEventThunk } from "../features/event/eventThunk";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from "./ui/dialog";
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
import { Calendar as CalendarIcon, Clock, Users, Globe } from "lucide-react";
import { format } from "date-fns";
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
  const [selectedTimezone, setSelectedTimezone] = useState(
    event.eventTimezone || "UTC"
  );
  const [startDate, setStartDate] = useState<Date>(new Date(event.startUtc));
  const [endDate, setEndDate] = useState<Date>(new Date(event.endUtc));
  const [startTime, setStartTime] = useState(
    dayjs(event.startUtc).format("HH:mm")
  );
  const [endTime, setEndTime] = useState(dayjs(event.endUtc).format("HH:mm"));

  useEffect(() => {
    if (open) {
      setSelectedProfiles(event.profiles);
      setSelectedTimezone(event.eventTimezone || "UTC");
      setStartDate(new Date(event.startUtc));
      setEndDate(new Date(event.endUtc));
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
    if (!selectedProfiles.length) {
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
          title: event.title,
        },
      })
    );

    toast.success("Event updated successfully");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Overlay */}
      <DialogOverlay
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      {/* Modal */}
      <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-lg w-full bg-card shadow-lg rounded-lg p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-semibold tracking-tight text-foreground">
            Edit Event
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Update event details and schedule
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profiles */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Users className="h-4 w-4 text-primary" />
              Profiles
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button className="w-full justify-between h-11 font-normal hover:border-primary/50 hover:bg-accent/50 transition-colors">
                  {selectedProfiles.length > 0
                    ? `${selectedProfiles.length} profile${
                        selectedProfiles.length > 1 ? "s" : ""
                      } selected`
                    : "Select profiles..."}
                  <Users className="h-4 w-4 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4 shadow-md">
                <div className="space-y-2">
                  {profiles.map((profile) => (
                    <label
                      key={profile._id}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedProfiles.includes(profile._id)}
                        onChange={() => handleProfileToggle(profile._id)}
                        className="h-4 w-4 rounded border checked:bg-primary checked:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                      <span className="text-sm text-foreground">
                        {profile.name}
                      </span>
                    </label>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Timezone */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Globe className="h-4 w-4 text-primary" />
              Timezone
            </Label>
            <Select
              value={selectedTimezone}
              onValueChange={setSelectedTimezone}
            >
              <SelectTrigger className="h-11 hover:border-primary/50 hover:bg-accent/50 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="shadow-md">
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
            <Label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <CalendarIcon className="h-4 w-4 text-primary" />
              Start Date & Time
            </Label>
            <div className="flex gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button className="flex-1 justify-start h-11 font-normal hover:border-primary/50 hover:bg-accent/50 transition-colors">
                    <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    {format(startDate, "MMM d, yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 shadow-md">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setStartDate(date)}
                    initialFocus
                    className="rounded-lg pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <div className="flex items-center gap-2.5 rounded-lg border border-border bg-background px-3.5 h-11">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-28 border-0 bg-transparent p-0 text-foreground focus-visible:ring-0 font-medium"
                />
              </div>
            </div>
          </div>

          {/* End Date & Time */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <CalendarIcon className="h-4 w-4 text-primary" />
              End Date & Time
            </Label>
            <div className="flex gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button className="flex-1 justify-start h-11 font-normal hover:border-primary/50 hover:bg-accent/50 transition-colors">
                    <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    {format(endDate, "MMM d, yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 shadow-md">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => date && setEndDate(date)}
                    initialFocus
                    className="rounded-lg pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <div className="flex items-center gap-2.5 rounded-lg border border-border bg-background px-3.5 h-11">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-28 border-0 bg-transparent p-0 text-foreground focus-visible:ring-0 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-border/50">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-11 hover:bg-secondary transition-colors"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 h-11 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all hover:shadow-md"
            >
              Update Event
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
