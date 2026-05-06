"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";

interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  isBlocked: boolean;
}

export default function UsersPage() {
  const { token } = useAuthStore();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 NEW STATES
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");

  // ===============================
  // FETCH USERS
  // ===============================
  useEffect(() => {
    if (!token) return;

    const loadUsers = async () => {
      try {
        setLoading(true);

        const res = await api.get(
          `/users/all-users?page=${page}&limit=5&search=${search}&role=${role}`
        );

        setUsers(res.data.data);
        setTotalPages(res.data.pagination.pages);

      } catch (error) {
        console.error("Error fetching users", error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [token, page, search, role]);

  // ===============================
  // BLOCK USER
  // ===============================
  const handleBlock = async (id: string) => {
    try {
      await api.patch(`/users/block-user/${id}`);

      setUsers((prev) =>
        prev.map((u) =>
          u._id === id ? { ...u, isBlocked: true } : u
        )
      );
    } catch (error) {
      console.error("Block failed", error);
    }
  };

  // ===============================
  // UNBLOCK USER
  // ===============================
  const handleUnblock = async (id: string) => {
    try {
      await api.patch(`/users/unblock-user/${id}`);

      setUsers((prev) =>
        prev.map((u) =>
          u._id === id ? { ...u, isBlocked: false } : u
        )
      );
    } catch (error) {
      console.error("Unblock failed", error);
    }
  };

  // ===============================
  // UI
  // ===============================
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">User Management</h1>

      {/* 🔍 SEARCH + FILTER */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="border p-2 rounded w-64"
          value={search}
          onChange={(e) => {
            setPage(1); // reset page
            setSearch(e.target.value);
          }}
        />

        <select
          className="border p-2 rounded"
          value={role}
          onChange={(e) => {
            setPage(1); // reset page
            setRole(e.target.value);
          }}
        >
          <option value="">All Roles</option>
          <option value="client">Client</option>
          <option value="lawyer">Lawyer</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="border-t">
                  <td className="p-3 font-medium">{user.fullName}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3 capitalize">{user.role}</td>

                  <td className="p-3">
                    {user.isBlocked ? (
                      <span className="text-red-600 font-semibold">
                        Blocked
                      </span>
                    ) : (
                      <span className="text-green-600 font-semibold">
                        Active
                      </span>
                    )}
                  </td>

                  <td className="p-3">
                    {user.isBlocked ? (
                      <Button
                        variant="outline"
                        onClick={() => handleUnblock(user._id)}
                      >
                        Unblock
                      </Button>
                    ) : (
                      <Button
                        variant="destructive"
                        onClick={() => handleBlock(user._id)}
                      >
                        Block
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 📄 PAGINATION */}
      <div className="flex justify-center gap-2">
        <Button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Prev
        </Button>

        <span className="px-4 py-2">
          Page {page} of {totalPages}
        </span>

        <Button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}