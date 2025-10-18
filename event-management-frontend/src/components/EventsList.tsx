// src/components/event/EventsList.tsx
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { EventCard } from "./EventCard";
import { fetchEvents } from "../features/event/eventThunk";

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

export const EventsList = () => {
  const dispatch = useAppDispatch();
  const events = useAppSelector((state) => state.events.events);
  const currentProfile = useAppSelector(
    (state) => state.profiles.selectedProfile
  );
  const [viewTimezone, setViewTimezone] = useState("America/New_York");

  useEffect(() => {
    dispatch(fetchEvents()); // fetch all events when component mounts
  }, [dispatch]);

  const displayEvents = currentProfile
    ? events.filter((e) => e.profiles.includes(currentProfile._id))
    : events;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Events</CardTitle>
        <div className="space-y-2 pt-4">
          <Label>View in Timezone</Label>
          <Select value={viewTimezone} onValueChange={setViewTimezone}>
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
      </CardHeader>
      <CardContent className="space-y-4">
        {displayEvents.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No events found
          </p>
        ) : (
          displayEvents.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              viewTimezone={viewTimezone}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
};
