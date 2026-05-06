"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CaseType {
  _id: string;
  caseCode: string;
  projectTitle: string;
  caseStatus: string;
  nextHearing: string;

  totalBilled: number;
  totalPaid: number;

  client?: {
    fullName: string;
    email: string;
  };

  lawyer?: {
    fullName: string;
    email: string;
  };
}

export default function CaseDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const setSelectedCase = useAuthStore(
    (state) => state.setSelectedCase
  );

  const [caseData, setCaseData] = useState<CaseType | null>(null);
  const [loading, setLoading] = useState(true);

  const caseId = params.id as string;

  // FETCH CASE
  useEffect(() => {
    if (!caseId) return;

    const fetchCase = async () => {
      try {
        const res = await api.get(`/users/GetCaseById/${caseId}`);

        if (res.data.status === "success") {
          setCaseData(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching case:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCase();
  }, [caseId]);

  if (loading) return null;

  if (!caseData) {
    return (
      <div className="p-6 text-red-500">Case not found</div>
    );
  }

  const amountDue =
    (caseData.totalBilled || 0) - (caseData.totalPaid || 0);

  return (
    <Dialog open onOpenChange={() => router.back()}>
      <DialogContent className="max-w-lg">

        <DialogHeader>
          <DialogTitle>Case Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">

          <div>
            <span className="font-semibold">Case Code:</span>{" "}
            {caseData.caseCode}
          </div>

          <div>
            <span className="font-semibold">Case Type:</span>{" "}
            {caseData.projectTitle}
          </div>

          <div>
            <span className="font-semibold">Status:</span>{" "}
            {caseData.caseStatus}
          </div>

          <div>
            <span className="font-semibold">Next Hearing:</span>{" "}
            {caseData.nextHearing}
          </div>

          {/* ================= 💰 PAYMENT SECTION ================= */}
          <div className="bg-slate-50 p-4 rounded-lg border space-y-2">
            <h3 className="font-semibold text-base">Payment Summary</h3>

            <p>
              <span className="font-medium">Total Billed:</span>{" "}
              ₹{caseData.totalBilled || 0}
            </p>

            <p className="text-green-600">
              <span className="font-medium">Paid:</span>{" "}
              ₹{caseData.totalPaid || 0}
            </p>

            <p className="text-red-600 font-semibold">
              <span className="font-medium">Due:</span> ₹{amountDue}
            </p>
          </div>

          <hr />

          {/* CLIENT */}
          <div>
            <h3 className="font-semibold">Client</h3>
            <p>{caseData.client?.fullName || "N/A"}</p>
            <p className="text-xs text-gray-500">
              {caseData.client?.email}
            </p>
          </div>

          {/* LAWYER */}
          <div>
            <h3 className="font-semibold">Lawyer</h3>
            <p>{caseData.lawyer?.fullName || "N/A"}</p>
            <p className="text-xs text-gray-500">
              {caseData.lawyer?.email}
            </p>
          </div>

          <hr />

          <Button
            className="w-full"
            onClick={() => {
              setSelectedCase({
                _id: caseData._id,
                caseCode: caseData.caseCode,
              });

              router.push("/dashboard/documents");
            }}
          >
            Open Documents
          </Button>

        </div>

      </DialogContent>
    </Dialog>
  );
}