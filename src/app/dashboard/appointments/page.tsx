"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ================= TYPES =================
interface AppointmentType {
  _id: string;
  status: "pending" | "accepted" | "rejected";
  lawyer: {
    fullName: string;
    specialization: string;
    avatar?: string;
  };
}

// ================= PAGE =================
export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH =================
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // ✅ FIXED API CALL
        const res = await api.get("/users/GetMyConsultations");

        setAppointments(res?.data?.data || []);
      } catch (err) {
        console.error("Appointments error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // ================= UI =================
  if (loading) return <p className="p-6">Loading appointments...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">

      <h2 className="text-2xl font-bold">My Appointments</h2>

      {appointments.length === 0 && (
        <p className="text-gray-500">
          You have not booked any consultation yet.
        </p>
      )}

      {appointments.map((a) => (
        <Card key={a._id}>
          <CardHeader>
            <CardTitle>{a.lawyer?.fullName}</CardTitle>
          </CardHeader>

          <CardContent className="flex justify-between items-center">

            <div>
              <p className="text-sm text-muted-foreground">
                {a.lawyer?.specialization}
              </p>

              <p
                className={`text-xs mt-1 font-medium ${
                  a.status === "pending"
                    ? "text-yellow-600"
                    : a.status === "accepted"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {a.status}
              </p>
            </div>

                {/* {a.status === "accepted" && (
                <button className="text-sm bg-blue-500 text-white px-3 py-1 rounded">
                    View Details
                </button>
                )} */}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}