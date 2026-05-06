"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

interface LawyerType {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  barId: string;
  createdAt: string;
}

export default function LawyerRequestsPage() {
  const [lawyers, setLawyers] = useState<LawyerType[]>([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/users/GetPendingLawyers");

        if (res.data.status === "success") {
          setLawyers(res.data.data);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ================= APPROVE =================
  const handleApprove = async (id: string) => {
    try {
      await api.post(`/users/ApproveLawyer/${id}`);
      setLawyers(prev => prev.filter(l => l._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // ================= REJECT =================
  const handleReject = async (id: string) => {
    try {
      await api.post(`/users/RejectLawyer/${id}`);
      setLawyers(prev => prev.filter(l => l._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold">Lawyer Approval Requests</h2>
        <p className="text-sm text-muted-foreground">
          Approve or reject newly registered lawyers
        </p>
      </div>

      {/* LIST */}
      {lawyers.length === 0 ? (
        <p>No pending requests</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {lawyers.map((lawyer) => (
            <Card key={lawyer._id}>

              <CardHeader>
                <CardTitle className="text-sm">
                  {lawyer.fullName}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-2 text-sm">
                <p><strong>Email:</strong> {lawyer.email}</p>
                <p><strong>Phone:</strong> {lawyer.phoneNumber || "N/A"}</p>
                <p><strong>Bar ID:</strong> {lawyer.barId || "N/A"}</p>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => handleApprove(lawyer._id)}
                  >
                    Approve
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    className="w-full"
                    onClick={() => handleReject(lawyer._id)}
                  >
                    Reject
                  </Button>
                </div>
              </CardContent>

            </Card>
          ))}

        </div>
      )}

    </div>
  );
}