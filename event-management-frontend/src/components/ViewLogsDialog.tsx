import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchEventLogs } from "../features/event/eventThunk";
import type { Event, EventLog } from "../types/event";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Card, CardContent } from "./ui/card";
import { Clock } from "lucide-react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

interface ViewLogsDialogProps {
  event: Event;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  viewTimezone: string;
}

export const ViewLogsDialog = ({
  event,
  open,
  onOpenChange,
  viewTimezone,
}: ViewLogsDialogProps) => {
  const dispatch = useAppDispatch();

  // Select logs from Redux
  const logs: EventLog[] = useAppSelector(
    (state) => state.events.eventLogs?.[event._id] || []
  );

  // Fetch logs when dialog opens
  useEffect(() => {
    if (open) {
      dispatch(fetchEventLogs(event._id));
    }
  }, [open, dispatch, event._id]);

  // Safely render any value as string
  const renderValue = (value: unknown) => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "object") return JSON.stringify(value, null, 2);
    return String(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Event Update Logs</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {logs.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No update logs yet
            </p>
          ) : (
            logs.map((log) => {
              const timestamp = dayjs(log.timestampUtc).tz(viewTimezone);

              return (
                <Card key={log._id}>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                          {timestamp.format("MMMM D, YYYY [at] h:mm:ss A")}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="text-sm font-medium">
                          Field: {log.field || log.eventId}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">
                              Previous
                            </div>
                            <div className="p-2 bg-destructive/10 rounded border border-destructive/20 whitespace-pre-wrap break-words">
                              {renderValue(log.before)}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">
                              Updated
                            </div>
                            <div className="p-2 bg-primary/10 rounded border border-primary/20 whitespace-pre-wrap break-words">
                              {renderValue(log.after)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
