"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Clock,
  MapPin,
  Gavel,
  AlertCircle,
  CalendarDays,
} from "lucide-react";

import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";


import { enUS } from "date-fns/locale";

interface EventType {
  id: number;
  date: string;
  time: string;
  case: string;
  court: string;
  type: string;
  priority: "High" | "Medium" | "Normal";
}

export default function CalendarPage() {
  const { user } = useAuthStore();

  //  SAFE LAZY INIT 
  const [events, setEvents] = useState<EventType[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("calendar-events");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  const [date, setDate] = useState<Date | undefined>(() => {
    if (typeof window !== "undefined") {
      return new Date();
    }
    return undefined;
  });

  const [form, setForm] = useState({
    time: "",
    case: "",
    court: "",
    type: "",
    priority: "Normal" as "High" | "Medium" | "Normal",
  });

  const isEditable = user?.role === "lawyer" || user?.role === "admin";

  // ✅ SAVE EVENTS
  const saveEvents = (updated: EventType[]) => {
    setEvents(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("calendar-events", JSON.stringify(updated));
    }
  };

  // ✅ ADD EVENT
  const handleAdd = () => {
    if (!date || !form.case || !form.time) {
      return toast.error("Fill required fields");
    }

    const newEvent: EventType = {
      id: Date.now(),
      date: date.toDateString(),
      ...form,
    };

    const updated = [...events, newEvent];
    saveEvents(updated);

    setForm({
      time: "",
      case: "",
      court: "",
      type: "",
      priority: "Normal",
    });

    toast.success("Event added");
  };

  // ✅ DELETE EVENT
  const handleDelete = (id: number) => {
    const updated = events.filter((e) => e.id !== id);
    saveEvents(updated);
  };

  // ✅ FILTER EVENTS
  const filteredEvents = events.filter(
    (e) => e.date === date?.toDateString()
  );

  // ✅ PREVENT SSR HYDRATION ISSUE
  if (!date) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-700">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
          <CalendarDays className="h-6 w-6" /> Hearing Schedule
        </h2>
        <p className="text-muted-foreground text-sm">
          Stay ahead of your court appearances and legal deadlines.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT: CALENDAR */}
        <Card className="lg:col-span-5 shadow-md bg-white p-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            locale={enUS} // ✅ CRITICAL FIX
          />

          {/* ADD EVENT FORM */}
          {isEditable && (
            <div className="mt-6 space-y-2">
              <Input
                placeholder="Time"
                value={form.time}
                onChange={(e) =>
                  setForm({ ...form, time: e.target.value })
                }
              />
              <Input
                placeholder="Case"
                value={form.case}
                onChange={(e) =>
                  setForm({ ...form, case: e.target.value })
                }
              />
              <Input
                placeholder="Court"
                value={form.court}
                onChange={(e) =>
                  setForm({ ...form, court: e.target.value })
                }
              />
              <Input
                placeholder="Type"
                value={form.type}
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value })
                }
              />

              <select
                className="border rounded-md p-2 w-full"
                value={form.priority}
                onChange={(e) =>
                  setForm({
                    ...form,
                    priority: e.target.value as "High" | "Medium" | "Normal",
                  })
                }
              >
                <option>High</option>
                <option>Medium</option>
                <option>Normal</option>
              </select>

              <Button className="w-full" onClick={handleAdd}>
                Add Event
              </Button>
            </div>
          )}
        </Card>

        {/* RIGHT: AGENDA */}
        <Card className="lg:col-span-7 shadow-md overflow-hidden bg-white">
          <CardHeader className="bg-primary/5 border-b flex justify-between">
            <CardTitle>
              Agenda for {date.toDateString()}
            </CardTitle>
            <Badge>{filteredEvents.length} Events</Badge>
          </CardHeader>

          <CardContent className="p-0">
            <ScrollArea className="h-96">
              {filteredEvents.length === 0 ? (
                <div className="flex flex-col items-center py-20 text-muted-foreground">
                  <AlertCircle className="h-10 w-10 mb-2 opacity-30" />
                  No events for this day
                </div>
              ) : (
                filteredEvents.map((item) => (
                  <div key={item.id} className="p-5 border-b relative group">

                    {item.priority === "High" && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
                    )}

                    <div className="flex justify-between">

                      <div>
                        <p className="font-bold text-primary flex items-center gap-2">
                          <Clock className="h-4 w-4" /> {item.time}
                        </p>

                        <p className="font-semibold">{item.case}</p>

                        <p className="text-sm text-muted-foreground flex gap-3">
                          <span><Gavel className="inline h-4 w-4" /> {item.type}</span>
                          <span><MapPin className="inline h-4 w-4" /> {item.court}</span>
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <Badge>{item.priority}</Badge>

                        {isEditable && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(item.id)}
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </ScrollArea>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}