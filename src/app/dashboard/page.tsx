"use client";

import React, { useEffect, useState } from "react";
import { Activity, ShieldAlert } from "lucide-react";
import api from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  TrendingUp,
  Clock,
  Scale,
  CheckCircle2,
  XCircle,
  Briefcase,
  Users,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// ================= TYPES =================

// CLIENT
interface ClientDashboard {
  stats: {
    totalBilled: number;
    totalPaid: number;
    nextHearing: string;
    caseStatus: string;
  };
  lawyer: {
    fullName: string;
    specialization: string;
    avatar?: string;
  };
  milestones: {
    label: string;
    date: string;
    status: "done" | "pending" | "error";
    subText?: string;
  }[];
  activities: {
    text: string;
    time: string;
  }[];
}

// LAWYER
interface LawyerDashboard {
  stats: {
    activeCases: number;
    totalClients: number;
    pendingTasks: number;
    closedCases: number;
  };
  hearings: {
    date: string;
    caseName: string;
    court: string;
    time: string;
    status: string;
  }[];
}

interface LawyerType {
  _id: string;
  fullName: string;
  specialization: string;
  avatar?: string;
}

// ADMIN
interface AdminDashboard {
  stats: {
    activeUsers: number;
    totalCases: number;
    alerts: number;
    revenue: number;
  };
  graphData: number[];
  logs: {
    time: string;
    text: string;
    user: string;
  }[];
}

// ================= MAIN =================

export default function DashboardPage() {
  const { user } = useAuthStore();

  const [clientData, setClientData] = useState<ClientDashboard | null>(null);
  const [lawyerData, setLawyerData] = useState<LawyerDashboard | null>(null);
  const [adminData, setAdminData] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const [openConsultation, setOpenConsultation] = useState(false);
  const [lawyers, setLawyers] = useState<LawyerType []>([]);
  const [selectedLawyer, setSelectedLawyer] = useState("");

  const userName = user?.fullName || "Guest";

  const fetchLawyers = async () => {
  try {
    const res = await api.get("/users/GetAllLawyers");
    setLawyers(res.data.data || []);
  } catch (err) {
    console.error(err);
  }
};

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        if (user.role === "client") {
          const res = await api.get("/users/GetClientDashboard");
          setClientData(res?.data?.data || null);
        }

        if (user.role === "lawyer") {
          const res = await api.get("/users/GetLawyerDashboard");
          setLawyerData(res?.data?.data || null);
        }

        if (user.role === "admin") {
          const res = await api.get("/users/GetAdminDashboard");
          setAdminData(res?.data?.data || null);
        }
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) return <p className="p-6">Loading dashboard...</p>;

  // ================= CLIENT =================
if (user?.role === "client") {

  const pieData = [
    { name: "Filed", value: 1 },
    { name: "Investigation", value: 1 },
    { name: "Hearing", value: 1 },
    { name: "Decision", value: 1 },
  ];

  const totalSteps = clientData?.milestones?.length || 0;

  const completedSteps =
    clientData?.milestones?.filter((m) => m.status === "done").length || 0;

  const progressPercent =
    totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  const activeIndex =
    clientData?.milestones?.findIndex((m) => m.status === "pending") ?? -1;

  return (
    <div className="space-y-6 max-w-350 mx-auto p-4">

      {/*  CONSULTATION DIALOG */}
      <Dialog open={openConsultation} onOpenChange={setOpenConsultation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Lawyer</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 max-h-60 overflow-y-auto">
            {lawyers.map((l) => (
              <div
                key={l._id}
                className={`p-3 border rounded cursor-pointer ${
                  selectedLawyer === l._id ? "bg-blue-100" : ""
                }`}
                onClick={() => setSelectedLawyer(l._id)}
              >
                <p className="font-medium">{l.fullName}</p>
                <p className="text-xs text-gray-500">{l.specialization}</p>
              </div>
            ))}
          </div>

          <Button
            disabled={!selectedLawyer}
            className="w-full"
            onClick={async () => {
              try {
                await api.post("/users/SendConsultationRequest", {
                  lawyerId: selectedLawyer,
                });

                alert("Request sent successfully ✅");

                setOpenConsultation(false);
                setSelectedLawyer("");
              } catch (err) {
                console.error(err);
              }
            }}
          >
            Send Request
          </Button>
        </DialogContent>
      </Dialog>

      {/* HEADER (ALWAYS VISIBLE ✅) */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Client Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Welcome back, {userName}
          </p>
        </div>

        <Button
          onClick={() => {
            setOpenConsultation(true);
            fetchLawyers();
          }}
        >
          Book Consultation
        </Button>
      </div>

      {/*  NO CASE DATA */}
      {!clientData && (
        <div className="text-center py-10 text-gray-500">
          No case found. Please book a consultation to get started.
        </div>
      )}

      {/*  SHOW DATA ONLY IF EXISTS */}
      {clientData && (
        <>
          {/* STATS */}
          <div className="grid md:grid-cols-4 gap-4">
            <StatCard title="Total Billed" value={`₹${clientData.stats.totalBilled}`} icon={FileText} />
            <StatCard title="Total Paid" value={`₹${clientData.stats.totalPaid}`} icon={TrendingUp} />
            <StatCard title="Next Hearing" value={clientData.stats.nextHearing} icon={Clock} />
            <StatCard title="Case Status" value={clientData.stats.caseStatus} icon={Scale} />
          </div>

          <div className="grid md:grid-cols-12 gap-6">

            {/* PIE */}
            <div className="md:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Case Distribution</CardTitle>
                </CardHeader>

                <CardContent className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} dataKey="value" outerRadius={70} label>
                        {pieData.map((_, i) => (
                          <Cell
                            key={i}
                            fill={["#3b82f6", "#22c55e", "#f59e0b", "#ef4444"][i]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* TRACKER */}
            <div className="md:col-span-9">
              <Card>
                <CardHeader>
                  <CardTitle>Case Status Tracker</CardTitle>
                </CardHeader>

                <CardContent>

                  <div className="w-full h-2 bg-gray-200 rounded-full mb-8">
                    <div
                      className="h-2 bg-green-500 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between relative">
                    <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-300 z-0" />

                    {clientData.milestones.map((m, i) => (
                      <TrackerStep
                        key={i}
                        {...m}
                        isActive={i === activeIndex}
                        isCompleted={m.status === "done"}
                      />
                    ))}
                  </div>

                  <div className="mt-10 space-y-3">
                    {clientData.activities.map((a, i) => (
                      <ActivityItem key={i} {...a} />
                    ))}
                  </div>

                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
  // ================= LAWYER =================
  if (user?.role === "lawyer" && lawyerData) {
    return (
      <div className="space-y-6 max-w-350 mx-auto p-4">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">Lawyer Dashboard</h2>
            <p className="text-sm text-muted-foreground">
              Welcome back, {userName}
            </p>
          </div>

          <div className="bg-green-100 px-4 py-2 rounded-full text-green-700 text-sm font-semibold">
            Practice success rate up 12%
          </div>
        </div>


        <Dialog open={openConsultation} onOpenChange={setOpenConsultation}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Select Lawyer</DialogTitle>
    </DialogHeader>

    <div className="space-y-3 max-h-60 overflow-y-auto">
      {lawyers.map((l) => (
        <div
          key={l._id}
          className={`p-3 border rounded cursor-pointer ${
            selectedLawyer === l._id ? "bg-blue-100" : ""
          }`}
          onClick={() => setSelectedLawyer(l._id)}
        >
          <p className="font-medium">{l.fullName}</p>
          <p className="text-xs text-gray-500">{l.specialization}</p>
        </div>
      ))}
    </div>

    <Button
      disabled={!selectedLawyer}
      className="w-full"
      onClick={async () => {
        try {
          await api.post("/users/SendConsultationRequest", {
            lawyerId: selectedLawyer,
          });

          alert("Request sent successfully ");

          setOpenConsultation(false);
          setSelectedLawyer("");
        } catch (err) {
          console.error(err);
        }
      }}
    >
      Send Request
    </Button>
  </DialogContent>
</Dialog>

        {/* STATS */}
        <div className="grid md:grid-cols-4 gap-4">
          <StatCard
            title="Active Cases"
            value={lawyerData.stats.activeCases}
            icon={Briefcase}
          />
          <StatCard
            title="Total Clients"
            value={lawyerData.stats.totalClients}
            icon={Users}
          />
          <StatCard
            title="Pending Tasks"
            value={lawyerData.stats.pendingTasks}
            icon={Clock}
          />
          <StatCard
            title="Closed Cases"
            value={lawyerData.stats.closedCases}
            icon={Scale}
          />
        </div>

        {/* MAIN */}
        <div className="grid md:grid-cols-12 gap-6">
          {/* HEARING */}
          <div className="md:col-span-8">
            <Card>
              <CardHeader>
                <CardTitle>Hearing Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {lawyerData.hearings.map((h, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center border p-3 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold">{h.caseName}</p>
                      <p className="text-xs text-muted-foreground">{h.date}</p>
                    </div>

                    <div
                      className={`w-3 h-3 rounded-full ${
                        h.status === "Ongoing" ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* GRAPH (REPLACED QUICK ACTIONS) */}
          <div className="md:col-span-4">
            <Card>
              <CardHeader>
                <CardTitle>Case Overview</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <GraphBar
                    value={lawyerData.stats.activeCases}
                    label="Active"
                    color="bg-blue-500"
                  />
                  <GraphBar
                    value={lawyerData.stats.closedCases}
                    label="Closed"
                    color="bg-emerald-500"
                  />
                  <GraphBar
                    value={lawyerData.stats.pendingTasks}
                    label="Pending"
                    color="bg-orange-500"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // ================= ADMIN =================
  if (user?.role === "admin" && adminData) {

  const pieData = adminData.graphData.map((val, i) => ({
    name: [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ][i],
    value: val,
  }));

  return (
    <div className="space-y-6 max-w-350 mx-auto p-4">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Admin Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Welcome back, {userName}
          </p>
        </div>

        <div className="bg-red-100 px-4 py-2 rounded-full text-red-600 text-sm font-semibold">
          Alerts: {adminData.stats.alerts}
        </div>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard title="Active Users" value={adminData.stats.activeUsers} icon={Users} />
        <StatCard title="Total Cases" value={adminData.stats.totalCases} icon={Briefcase} />
        <StatCard title="Alerts" value={adminData.stats.alerts} icon={ShieldAlert} />
        <StatCard title="Revenue" value={`₹${adminData.stats.revenue}`} icon={TrendingUp} />
      </div>

      {/* TRACKER */}
      <Card>
        <CardHeader>
          <CardTitle>System Tracker</CardTitle>
        </CardHeader>

        <CardContent className="flex justify-between flex-wrap gap-6">
          <AdminTrackerItem label="Users Active" value={adminData.stats.activeUsers} />
          <AdminTrackerItem label="Cases Running" value={adminData.stats.totalCases} />
          <AdminTrackerItem label="Alerts Raised" value={adminData.stats.alerts} />
          <AdminTrackerItem label="Revenue" value={adminData.stats.revenue} />
        </CardContent>
      </Card>

      {/* PIE + LOGS */}
      <div className="grid md:grid-cols-12 gap-6">

        {/* PIE CHART */}
        <div className="md:col-span-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Users</CardTitle>
            </CardHeader>

            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    outerRadius={90}
                    label
                  >
                    {pieData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={[
                          "#3b82f6","#22c55e","#f59e0b","#ef4444",
                          "#8b5cf6","#06b6d4","#10b981","#f97316",
                          "#6366f1","#14b8a6","#e11d48","#84cc16"
                        ][i]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* LOGS */}
        <div className="md:col-span-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {adminData.logs.map((log, i) => (
                <div key={i} className="flex justify-between text-sm border-b pb-2">
                  <span>{log.time}</span>
                  <span>{log.text}</span>
                  <span className="font-semibold">{log.user}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
  return <div className="p-6">No dashboard data</div>;
}

// ================= COMPONENTS =================

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number | string;
  icon: React.ElementType;
}) {
  return (
    <Card>
      <CardHeader className="flex justify-between">
        <CardTitle className="text-xs">{title}</CardTitle>
        <Icon className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <p className="text-xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

function GraphBar({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) {
  const height = Math.max(Math.min(value * 8, 100), 10);

  return (
    <div className="flex flex-col items-center justify-end w-full">
      {/* Chart area */}
      <div className="w-full h-28 bg-slate-100 rounded-md flex items-end p-1">
        <div
          className={`w-full ${color} rounded-md transition-all duration-500`}
          style={{ height: `${height}%` }}
        />
      </div>

      {/* Label */}
      <span className="text-[11px] text-slate-500 mt-2">{label}</span>

      {/* Value */}
      <span className="text-sm font-semibold text-slate-800">{value}</span>
    </div>
  );
}

type TrackerStepProps = {
  label: string;
  date: string;
  status: "done" | "pending" | "error";
  subText?: string;
  isActive: boolean;
  isCompleted: boolean;
};

function TrackerStep({
  label,
  date,
  status,
  subText,
  isActive,
  isCompleted,
}: TrackerStepProps)     {
  return (
    <div className="flex flex-col items-center relative z-10 flex-1">

      {/* CIRCLE */}
      <div
        className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all
        ${
          isCompleted
            ? "bg-green-500 border-green-500 text-white"
            : isActive
            ? "bg-blue-500 border-blue-500 text-white"
            : status === "error"
            ? "bg-red-500 border-red-500 text-white"
            : "bg-white border-gray-300"
        }`}
      >
        {isCompleted && <CheckCircle2 className="w-5 h-5" />}
        {status === "error" && <XCircle className="w-5 h-5" />}
        {isActive && !isCompleted && <Clock className="w-4 h-4" />}
      </div>

      {/* LABEL */}
      <p className="text-xs mt-2 font-medium text-center">{label}</p>

      {/* DATE */}
      <p className="text-[11px] text-muted-foreground">{date}</p>

      {subText && (
        <p className="text-red-500 text-[10px] text-center">{subText}</p>
      )}
    </div>
  );
}

function ActivityItem({ text, time }: ClientDashboard["activities"][number]) {
  return (
    <div className="text-sm">
      <p>{text}</p>
      <p className="text-xs text-muted-foreground">{time}</p>
    </div>
  );
}

function AdminTrackerItem({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
        <Activity className="w-4 h-4 text-blue-600" />
      </div>
      <p className="text-xs mt-2">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
} 