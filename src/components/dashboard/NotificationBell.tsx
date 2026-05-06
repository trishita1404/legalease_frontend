"use client";

import { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import api from "@/lib/axios";
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Notification {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationBell() {

  const { user } = useAuthStore();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const hasFetched = useRef(false);

  // =========================
  // FETCH NOTIFICATIONS
  // =========================
  const fetchNotifications = async () => {
    try {

      const res = await api.get("/notifications/my");

      if (res?.data?.status === "success") {
        setNotifications(res.data.data || []);
      }

    } catch (err: unknown) {

      if (axios.isAxiosError(err)) {

        if (err.response?.status !== 404) {
          console.error("Notification error:", err.message);
        }

      } else {
        console.error("Unexpected error:", err);
      }

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // MARK AS READ
  // =========================
  const markAsRead = async () => {
    try {

      await api.patch("/notifications/mark-read");

      //  Update UI instantly
      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          isRead: true,
        }))
      );

    } catch {
      console.error("Mark read failed");
    }
  };

  // =========================
  // LOAD NOTIFICATIONS
  // =========================
  useEffect(() => {

  //  Prevent double execution in strict mode
  if (hasFetched.current) return;

  hasFetched.current = true;

  //  Skip admin
  if (user?.role === "admin") return;

  // Avoid direct setState inside effect
  const loadNotifications = async () => {
    await fetchNotifications();
  };

  loadNotifications();

  const interval = setInterval(() => {
    fetchNotifications();
  }, 10000);

  return () => clearInterval(interval);

}, [user]);

  // =========================
  // UNREAD COUNT
  // =========================
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <DropdownMenu
      onOpenChange={(open) => {

        //  Skip admin
        if (
          open &&
          unreadCount > 0 &&
          user?.role !== "admin"
        ) {
          markAsRead();
        }

      }}
    >

      <DropdownMenuTrigger asChild>

        <Button variant="ghost" className="relative h-10 w-10">

          <Bell className="h-5 w-5" />

          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-4 w-4 text-xs flex items-center justify-center rounded-full bg-red-500 text-white">
              {unreadCount}
            </span>
          )}

        </Button>

      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80 p-2" align="end">

        <div className="max-h-80 overflow-y-auto space-y-2">

          {loading && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Loading...
            </p>
          )}

          {!loading && notifications.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No notifications
            </p>
          )}

          {notifications.map((n) => (
            <div
              key={n._id}
              className={`p-3 rounded-lg border text-sm ${
                n.isRead
                  ? "bg-muted"
                  : "bg-primary/5 border-primary/20"
              }`}
            >

              <p className="font-semibold">
                {n.title}
              </p>

              <p className="text-xs text-muted-foreground">
                {n.message}
              </p>

            </div>
          ))}

        </div>

      </DropdownMenuContent>

    </DropdownMenu>
  );
}