// src/components/event/EventCard.tsx
import { useState } from "react";
import type { Event } from "../types/event";
import { useAppSelector } from "../app/hooks";

import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Calendar, Clock, Users, Edit, FileText } from "lucide-react";
import { EditEventDialog } from "./EditEventDialog";

import { ViewLogsDialog } from "./ViewLogsDialog";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

interface EventCardProps {
  event: Event;
  viewTimezone: string;
}

export const EventCard = ({ event, viewTimezone }: EventCardProps) => {
  const profiles = useAppSelector((state) => state.profiles.profiles);
  const [editOpen, setEditOpen] = useState(false);
  const [logsOpen, setLogsOpen] = useState(false);

  // Map profile IDs to profile names
  const eventProfiles = profiles.filter((p) => event.profiles.includes(p._id));
  const profileNames = eventProfiles.map((p) => p.name).join(", ");

  const startDateTime = dayjs
    .tz(event.startUtc, event.eventTimezone)
    .tz(viewTimezone);

  const endDateTime = dayjs
    .tz(event.endUtc, event.eventTimezone)
    .tz(viewTimezone);

  const createdAt = dayjs(event.created_at).tz(viewTimezone);
  const updatedAt = dayjs(event.updated_at).tz(viewTimezone);

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span className="font-medium text-foreground">{profileNames}</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div className="flex-1">
                <div className="text-sm font-medium">
                  Start: {startDateTime.format("MMM D, YYYY")}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {startDateTime.format("h:mm A")}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div className="flex-1">
                <div className="text-sm font-medium">
                  End: {endDateTime.format("MMM D, YYYY")}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {endDateTime.format("h:mm A")}
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
            <div>
              Created: {createdAt.format("MMM D, YYYY")} at{" "}
              {createdAt.format("h:mm A")}
            </div>
            <div>
              Updated: {updatedAt.format("MMM D, YYYY")} at{" "}
              {updatedAt.format("h:mm A")}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditOpen(true)}
              className="flex-1"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLogsOpen(true)}
              className="flex-1"
            >
              <FileText className="mr-2 h-4 w-4" />
              View Logs
            </Button>
          </div>
        </CardContent>
      </Card>

      <EditEventDialog
        event={event}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <ViewLogsDialog
        event={event}
        open={logsOpen}
        onOpenChange={setLogsOpen}
        viewTimezone={viewTimezone}
      />
    </>
  );
};
