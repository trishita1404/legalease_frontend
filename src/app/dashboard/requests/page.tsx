"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";

// ================= TYPES =================
interface RequestType {
  _id: string;
  status: "pending" | "accepted" | "rejected";
  client?: {
    fullName: string;
  };
}

// ================= PAGE =================
export default function RequestsPage() {
  const [requests, setRequests] = useState<RequestType[]>([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH =================
  const fetchRequests = async () => {
    try {
      const res = await api.get("/users/GetConsultationRequests");
      setRequests(res?.data?.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED useEffect
  useEffect(() => {
    const loadData = async () => {
      await fetchRequests();
    };

    loadData();
  }, []);

  // ================= ACTION HANDLERS =================
  const handleUpdate = async (
    id: string,
    status: "accepted" | "rejected"
  ) => {
    try {
      await api.post("/users/UpdateConsultationRequest", {
        requestId: id,
        status,
      });

      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.post("/users/DeleteConsultationRequest", {
        requestId: id,
      });

      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= UI =================
  if (loading) return <p className="p-6">Loading requests...</p>;

  return (
    <div className="p-6 space-y-4 max-w-4xl mx-auto">

      <h2 className="text-2xl font-bold">Client Requests</h2>

      {requests.length === 0 && (
        <p className="text-gray-500">No requests found</p>
      )}

      {requests.map((r) => (
        <div
          key={r._id}
          className="border p-4 rounded-lg flex justify-between items-center shadow-sm"
        >
          {/* LEFT */}
          <div>
            <p className="font-semibold text-lg">
              {r.client?.fullName || "Unknown Client"}
            </p>

            <p
              className={`text-sm mt-1 ${
                r.status === "pending"
                  ? "text-yellow-600"
                  : r.status === "accepted"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {r.status}
            </p>
          </div>

          {/* RIGHT BUTTONS */}
          <div className="flex gap-2">

            {r.status === "pending" && (
              <>
                <Button
                  className="bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => handleUpdate(r._id, "accepted")}
                >
                  Accept
                </Button>

                <Button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                  onClick={() => handleUpdate(r._id, "rejected")}
                >
                  Reject
                </Button>
              </>
            )}

            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => handleDelete(r._id)}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}