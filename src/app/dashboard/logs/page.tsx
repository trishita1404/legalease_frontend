"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ===============================
// TYPES
// ===============================
interface LogType {
  time: string;
  user: string;
  action: string;
  module: string;
  status: string;
}

interface PaginationType {
  total: number;
  page: number;
  pages: number;
}

// ===============================
// PAGE
// ===============================
export default function SystemLogsPage() {
  const [logs, setLogs] = useState<LogType[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationType>({
    total: 0,
    page: 1,
    pages: 1,
  });

  const LIMIT = 10;

  // ===============================
  // FETCH LOGS
  // ===============================
  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);

      try {
        const res = await api.get(
          `/users/GetSystemLogs?page=${page}&limit=${LIMIT}`
        );

        setLogs(res.data.data || []);
        setPagination(res.data.pagination || { total: 0, page: 1, pages: 1 });

      } catch (err) {
        console.error("Logs fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [page]);

  // ===============================
  // STATS (BASED ON CURRENT PAGE)
  // ===============================
  const totalLogs = pagination.total;
  const loginEvents = logs.filter((l) => l.module === "Auth").length;
  const caseActivities = logs.filter((l) => l.module === "Case").length;
  const userActions = logs.filter((l) => l.module === "User").length;
  const systemAlerts = logs.filter((l) => l.status !== "Success").length;

  // ===============================
  // UI
  // ===============================
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">System Logs</h1>
        <p className="text-muted-foreground text-sm">
          Monitor all system activities and events
        </p>
      </div>

      {/* FILTERS (UI ONLY) */}
      <div className="flex flex-wrap gap-3 items-center">
        <Input type="date" className="w-45" />
        <Input type="date" className="w-45" />

        <select className="border rounded-md px-3 py-2 text-sm">
          <option>All Actions</option>
        </select>

        <select className="border rounded-md px-3 py-2 text-sm">
          <option>All Users</option>
        </select>

        <Button className="ml-auto">Export Logs</Button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { title: "Total Logs", value: totalLogs },
          { title: "Login Events", value: loginEvents },
          { title: "Case Activities", value: caseActivities },
          { title: "User Actions", value: userActions },
          { title: "System Alerts", value: systemAlerts },
        ].map((item, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{item.title}</p>
              <h2 className="text-xl font-bold">{item.value}</h2>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* TABLE */}
      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-3 text-left">Time</th>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Action</th>
              <th className="p-3 text-left">Module</th>
              <th className="p-3 text-left">Details</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center p-6">
                  Loading logs...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-6 text-muted-foreground">
                  No logs found
                </td>
              </tr>
            ) : (
              logs.map((log, i) => (
                <tr key={i} className="border-t">
                  <td className="p-3">
                    {new Date(log.time).toLocaleString()}
                  </td>

                  <td className="p-3">{log.user}</td>
                  <td className="p-3">{log.action}</td>
                  <td className="p-3">{log.module}</td>
                  <td className="p-3">System activity</td>

                  <td className="p-3">
                    <Badge
                      variant={
                        log.status === "Success"
                          ? "default"
                          : log.status === "Warning"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {log.status}
                    </Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-end items-center gap-2 pt-4">

        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </Button>

        <span className="text-sm">
          Page {pagination.page} of {pagination.pages}
        </span>

        <Button
          variant="outline"
          disabled={page === pagination.pages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>

      </div>

    </div>
  );
}