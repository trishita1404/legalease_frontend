"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { Megaphone, Trash2 } from "lucide-react";
import { toast } from "sonner";

// ==========================
// TYPES
// ==========================
interface Announcement {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
}

export default function AnnouncementsPage() {
  const { user } = useAuthStore();

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    message: "",
  });

  const isAdmin = user?.role === "admin";

  // ==========================
  // ✅ FIXED EFFECT (NO WARNING)
  // ==========================
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.get("/users/announcements");

        if (res.data.status === "success") {
          setAnnouncements(res.data.data);
        }
      } catch  {
        toast.error("Failed to load announcements");
      }
    };

    loadData();
  }, []);

  // ==========================
  // CREATE
  // ==========================
  const handleCreate = async () => {
    if (!form.title || !form.message) {
      return toast.error("Fill all fields");
    }

    setLoading(true);

    try {
      const res = await api.post("/users/announcements", form);

      if (res.data.status === "success") {
        toast.success("Announcement created");
        setForm({ title: "", message: "" });

        // 🔥 reload list
        const refreshed = await api.get("/users/announcements");
        setAnnouncements(refreshed.data.data);
      }
    } catch  {
      toast.error("Failed to create announcement");
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // DELETE
  // ==========================
  const handleDelete = async (id: string) => {
    try {
      const res = await api.delete(`/users/announcements/${id}`);

      if (res.data.status === "success") {
        toast.success("Deleted");

        // 🔥 update locally (better UX)
        setAnnouncements((prev) => prev.filter((a) => a._id !== id));
      }
    } catch  {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
          <Megaphone className="h-6 w-6" />
          Announcements
        </h2>
        <p className="text-muted-foreground text-sm">
          Stay updated with important notices.
        </p>
      </div>

      {/* ADMIN CREATE */}
      {isAdmin && (
        <Card className="shadow-md bg-white">
          <CardHeader>
            <CardTitle>Create Announcement</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            <Input
              placeholder="Title"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
            />

            <textarea
              className="w-full border rounded p-2 min-h-25"
              placeholder="Message"
              value={form.message}
              onChange={(e) =>
                setForm({ ...form, message: e.target.value })
              }
            />

            <Button onClick={handleCreate} disabled={loading}>
              {loading ? "Posting..." : "Post Announcement"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* LIST */}
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            No announcements available
          </div>
        ) : (
          announcements.map((item) => (
            <Card key={item._id} className="shadow-sm bg-white">
              <CardContent className="p-5">

                <div className="flex justify-between items-start">

                  <div>
                    <h3 className="font-semibold text-lg">
                      {item.title}
                    </h3>

                    <p className="text-sm text-muted-foreground mt-1">
                      {item.message}
                    </p>

                    <Badge className="mt-2">
                      {new Date(item.createdAt).toLocaleString()}
                    </Badge>
                  </div>

                  {isAdmin && (
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleDelete(item._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}   