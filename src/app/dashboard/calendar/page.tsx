"use client";

import { useState } from "react";

import { Calendar } from "@/components/ui/calendar";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { ScrollArea } from "@/components/ui/scroll-area";

import { Button } from "@/components/ui/button";

import {
  Clock,
  AlertCircle,
  CalendarDays,
} from "lucide-react";

import { useAuthStore } from "@/store/useAuthStore";

import { toast } from "sonner";

import { enUS } from "date-fns/locale";

import api from "@/lib/axios";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

// ===============================
// TYPES
// ===============================
interface EventType {
  _id: string;

  caseId: string;

  caseCode: string;

  scheduleDateTime: string;

  priority: "High" | "Medium" | "Normal";
}

interface CaseType {
  _id: string;

  caseCode: string;
}

export default function CalendarPage() {

  const { user } = useAuthStore();

  const queryClient = useQueryClient();

  const [date, setDate] = useState<Date | undefined>(
    new Date()
  );

  const [form, setForm] = useState({
    caseId: "",
    caseCode: "",
    scheduleDateTime: "",
    priority: "Normal" as
      | "High"
      | "Medium"
      | "Normal",
  });

  const isEditable =
    user?.role === "lawyer" ||
    user?.role === "admin";

  // ===============================
  // FETCH EVENTS
  // ===============================
  const { data: events = [] } = useQuery({

    queryKey: ["calendar-events"],

    queryFn: async () => {

      const res = await api.get(
        "/users/events"
      );

      return res.data.data;
    },
  });

  // ===============================
  // FETCH CASES
  // ===============================
  const { data: cases = [] } = useQuery({

    queryKey: ["calendar-cases"],

    queryFn: async () => {

      const res = await api.get(
        "/users/calendar-cases"
      );

      return res.data.data;
    },

    enabled: !!user,
  });

  // ===============================
  // CREATE EVENT
  // ===============================
  const createMutation = useMutation({

    mutationFn: async () => {

      const res = await api.post(
        "/users/events/create",
        form
      );

      return res.data;
    },

    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ["calendar-events"],
      });

      toast.success(
        "Schedule created successfully"
      );

      setForm({
        caseId: "",
        caseCode: "",
        scheduleDateTime: "",
        priority: "Normal",
      });
    },

    onError: (error: unknown) => {

      const err = error as {
        response?: {
          data?: {
            message?: string;
          };
        };
      };

      toast.error(
        err.response?.data?.message ||
        "Failed to create schedule"
      );
    },
  });

  // ===============================
  // DELETE EVENT
  // ===============================
  const deleteMutation = useMutation({

    mutationFn: async (
      eventId: string
    ) => {

      return await api.post(
        "/users/events/delete",
        {
          eventId,
        }
      );
    },

    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ["calendar-events"],
      });

      toast.success(
        "Schedule deleted"
      );
    },
  });

  // ===============================
  // HANDLE CREATE
  // ===============================
  const handleAdd = () => {

    if (
      !form.caseId ||
      !form.scheduleDateTime
    ) {

      return toast.error(
        "Please fill required fields"
      );
    }

    createMutation.mutate();
  };

  // ===============================
  // FILTER EVENTS
  // ===============================
  const filteredEvents = events.filter(
    (event: EventType) => {

      const eventDate = new Date(
        event.scheduleDateTime
      ).toDateString();

      return (
        eventDate ===
        date?.toDateString()
      );
    }
  );

  // ===============================
  // HANDLE CASE SELECT
  // ===============================
  const handleCaseChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {

    const selectedCase = cases.find(
      (c: CaseType) =>
        c._id === e.target.value
    );

    if (!selectedCase) return;

    setForm({
      ...form,

      caseId: selectedCase._id,

      caseCode:
        selectedCase.caseCode,
    });
  };

  if (!date) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-700">

      {/* HEADER */}
      <div>

        <h2 className="text-2xl font-bold text-primary flex items-center gap-2">

          <CalendarDays className="h-6 w-6" />

          Hearing Schedule

        </h2>

        <p className="text-muted-foreground text-sm">

          Stay ahead of hearings and legal deadlines.

        </p>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT */}
        <Card className="lg:col-span-5 shadow-md bg-white p-4">

          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            locale={enUS}
          />

          {/* CREATE FORM */}
          {isEditable && (

            <div className="mt-6 space-y-3">

              {/* CASE DROPDOWN */}
              <select
                className="border rounded-md p-2 w-full"
                value={form.caseId}
                onChange={handleCaseChange}
              >

                <option value="">
                  Select Case Code
                </option>

                {cases.map(
                  (item: CaseType) => (

                    <option
                      key={item._id}
                      value={item._id}
                    >
                      {item.caseCode}
                    </option>

                  )
                )}

              </select>

              {/* DATE TIME */}
              <input
                type="datetime-local"
                className="border rounded-md p-2 w-full"

                value={
                  form.scheduleDateTime
                }

                onChange={(e) =>
                  setForm({
                    ...form,

                    scheduleDateTime:
                      e.target.value,
                  })
                }
              />

              {/* PRIORITY */}
              <select
                className="border rounded-md p-2 w-full"

                value={form.priority}

                onChange={(e) =>
                  setForm({
                    ...form,

                    priority:
                      e.target
                        .value as
                        | "High"
                        | "Medium"
                        | "Normal",
                  })
                }
              >

                <option>
                  High
                </option>

                <option>
                  Medium
                </option>

                <option>
                  Normal
                </option>

              </select>

              <Button
                className="w-full"
                onClick={handleAdd}
                disabled={
                  createMutation.isPending
                }
              >

                {createMutation.isPending
                  ? "Creating..."
                  : "Create Schedule"}

              </Button>

            </div>
          )}

        </Card>

        {/* RIGHT */}
        <Card className="lg:col-span-7 shadow-md overflow-hidden bg-white">

          <CardHeader className="bg-primary/5 border-b flex justify-between">

            <CardTitle>
              Agenda for{" "}
              {date.toDateString()}
            </CardTitle>

            <Badge>
              {
                filteredEvents.length
              }{" "}
              Events
            </Badge>

          </CardHeader>

          <CardContent className="p-0">

            <ScrollArea className="h-96">

              {filteredEvents.length ===
              0 ? (

                <div className="flex flex-col items-center py-20 text-muted-foreground">

                  <AlertCircle className="h-10 w-10 mb-2 opacity-30" />

                  No schedules for this day

                </div>

              ) : (

                filteredEvents.map(
                  (
                    item: EventType
                  ) => (

                    <div
                      key={item._id}
                      className="p-5 border-b relative"
                    >

                      {item.priority ===
                        "High" && (

                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />

                      )}

                      <div className="flex justify-between">

                        <div>

                          <p className="font-bold text-primary flex items-center gap-2">

                            <Clock className="h-4 w-4" />

                            {new Date(
                              item.scheduleDateTime
                            ).toLocaleTimeString(
                              [],
                              {
                                hour:
                                  "2-digit",

                                minute:
                                  "2-digit",
                              }
                            )}

                          </p>

                          <p className="font-semibold">

                            {
                              item.caseCode
                            }

                          </p>

                          <p className="text-sm text-muted-foreground">

                            Hearing Schedule

                          </p>

                        </div>

                        <div className="flex flex-col items-end gap-2">

                          <Badge>
                            {
                              item.priority
                            }
                          </Badge>

                          {isEditable && (

                            <Button
                              size="sm"

                              variant="destructive"

                              onClick={() =>
                                deleteMutation.mutate(
                                  item._id
                                )
                              }
                            >

                              Delete

                            </Button>

                          )}

                        </div>
                      </div>
                    </div>
                  )
                )
              )}

            </ScrollArea>

          </CardContent>

        </Card>

      </div>
    </div>
  );
}