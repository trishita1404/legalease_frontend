"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { CreditCard } from "lucide-react";

// ✅ Razorpay typing fix
declare global {
  interface RazorpayOptions {
    key: string | undefined;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: () => void;
    prefill: {
      name?: string;
      email?: string;
    };
    theme: {
      color: string;
    };
  }

  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

interface CaseType {
  _id: string;
  caseCode: string;
  projectTitle: string;
  totalBilled: number;
  totalPaid: number;
  client?: { fullName: string };
  lawyer?: { fullName: string };
}

export default function PaymentsPage() {
  const { user } = useAuthStore();

  const [cases, setCases] = useState<CaseType[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ================= FETCH =================
  useEffect(() => {
    if (!user) return;

    const fetchCases = async () => {
      try {
        let res;

        if (user.role === "client") {
          res = await api.get("/users/GetMyCases");
        } else if (user.role === "admin") {
          res = await api.get("/users/GetAllCases");
        } else {
          res = await api.get("/users/GetLawyerCases");
        }

        setCases(res.data.data || []);
      } catch (error) {
        console.error("Payment fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, [user]); // ✅ fixed warning

  // ================= ROLE FLAGS =================
  const isClient = user?.role === "client";
  const isLawyer = user?.role === "lawyer";
  const isAdmin = user?.role === "admin";

  // ================= PAGINATION =================
  const totalPages = Math.ceil(cases.length / itemsPerPage);

  const paginatedCases = cases.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ================= DELETE =================
  const handleDelete = async (id: string) => {
    try {
      await api.post("/users/DeleteCase", { caseId: id });
      setCases((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // ================= RAZORPAY LOADER =================
  const loadRazorpay = () => {
    return new Promise<boolean>((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // ================= PAYMENT =================
  const handlePayment = async (c: CaseType, amountDue: number) => {
    const loaded = await loadRazorpay();

    if (!loaded) {
      alert("Razorpay SDK failed to load");
      return;
    }

    try {
      const orderRes = await api.post("/users/CreateOrder", {
        amount: amountDue,
      });

      const order = orderRes.data.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "LegalEase+",
        description: "Case Payment",
        order_id: order.id,

        handler: async () => {
          await api.post("/users/MakePayment", {
            caseId: c._id,
            amount: amountDue,
          });

          alert("Payment Successful ✅");

          const res = await api.get("/users/GetMyCases");
          setCases(res.data.data || []);
        },

        prefill: {
          name: user?.fullName,
          email: user?.email,
        },

        theme: {
          color: "#0f172a",
        },
      };

      // ✅ fixed typing
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      console.error(err);
      alert("Payment failed ❌");
    }
  };

  if (loading) return <p className="p-6">Loading payments...</p>;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold">
          {isClient ? "Payment Center" : "Payment History"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {isClient
            ? "Manage all your case payments"
            : "View all payment records"}
        </p>
      </div>

      {/* ADMIN / LAWYER */}
      {(isLawyer || isAdmin) && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-3 text-left">Case</th>
                  <th className="p-3 text-left">Client</th>
                  {isAdmin && <th className="p-3 text-left">Lawyer</th>}
                  <th className="p-3 text-left">Paid</th>
                  <th className="p-3 text-left">Total</th>
                  <th className="p-3 text-left">Due</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {paginatedCases.map((c) => {
                  const due = c.totalBilled - c.totalPaid;

                  return (
                    <tr key={c._id} className="border-t">
                      <td className="p-3">{c.caseCode}</td>
                      <td className="p-3">{c.client?.fullName || "N/A"}</td>

                      {isAdmin && (
                        <td className="p-3">{c.lawyer?.fullName || "N/A"}</td>
                      )}

                      <td className="p-3 text-green-600">₹{c.totalPaid}</td>
                      <td className="p-3">₹{c.totalBilled}</td>
                      <td className="p-3 text-red-600">₹{due}</td>

                      <td className="p-3">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(c._id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex justify-center gap-3">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </Button>

            <span>
              Page {currentPage} of {totalPages || 1}
            </span>

            <Button
              variant="outline"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* CLIENT */}
      {isClient && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((c) => {
            const amountDue = c.totalBilled - c.totalPaid;

            return (
              <Card key={c._id}>
                <CardHeader>
                  <CardTitle className="flex justify-between text-sm">
                    <span>{c.caseCode}</span>
                    <Badge variant={amountDue > 0 ? "destructive" : "secondary"}>
                      {amountDue > 0 ? "Due" : "Paid"}
                    </Badge>
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm">{c.projectTitle}</p>

                  <div className="text-sm">
                    <p>Total: ₹{c.totalBilled}</p>
                    <p className="text-green-600">Paid: ₹{c.totalPaid}</p>
                    <p className="text-red-600">Due: ₹{amountDue}</p>
                  </div>

                  <Button
                    disabled={amountDue <= 0}
                    className="w-full flex gap-2"
                    onClick={() => handlePayment(c, amountDue)}
                  >
                    <CreditCard className="w-4 h-4" />
                    Pay Now
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}