"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface CaseType {
  _id: string;
  caseCode: string;
  projectTitle: string;
  caseStatus: string;
  nextHearing: string;

  client?: {
    _id: string;
    fullName: string;
  };

  lawyer?: {
    fullName: string;
  };
}

interface ClientType {
  _id: string;
  fullName: string;
  email: string;
}

export default function CasesPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const isClientUser = user?.role === "client";
  const isAdminUser = user?.role === "admin";

  const [searchTerm, setSearchTerm] = useState("");
  const [cases, setCases] = useState<CaseType[]>([]);
  const [clients, setClients] = useState<ClientType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editCase, setEditCase] = useState<CaseType | null>(null);

  const [form, setForm] = useState({
    caseCode: "",
    clientId: "",
    projectTitle: "",
    nextHearing: "",
    caseStatus: "Ongoing",
    totalBilled: ""
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // ================= FETCH =================
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        let caseRes;

        if (isClientUser) {
          caseRes = await api.get("/users/GetMyCases");
        } else if (isAdminUser) {
          caseRes = await api.get("/users/GetAllCases");
        } else {
          caseRes = await api.get("/users/GetLawyerCases");
        }

        if (caseRes?.data?.status === "success") {
          setCases(caseRes.data.data);
        }

        // ✅ FIXED: ONLY lawyer gets accepted clients
        if (user?.role === "lawyer") {
          const clientRes = await api.get("/users/GetAcceptedClients");

          if (clientRes?.data?.status === "success") {
            setClients(clientRes.data.data);
          }
        }

      } catch (error) {
        console.error("FETCH ERROR:", error);
      }
    };

    fetchData();
  }, [user]);

   // ================= CREATE =================
const handleCreateCase = async () => {

  try {

    console.log("CREATE CASE FORM:", form);

    // ✅ FIXED PAYLOAD
    const payload = {
      caseCode: form.caseCode,
      clientId: form.clientId,
      projectTitle: form.projectTitle,
      nextHearing: form.nextHearing,
      caseStatus: form.caseStatus,
      totalBilled: Number(form.totalBilled),
    };

    console.log("PAYLOAD:", payload);

    const res = await api.post(
      "/users/CreateCase",
      payload
    );

    console.log("RESPONSE:", res.data);

    if (res.data.status === "success") {

      setShowModal(false);

      resetForm();

      reloadCases();
    }

  } catch (err: unknown) {

    console.error("CREATE CASE ERROR:", err);

    const error = err as {
      response?: {
        data?: {
          message?: string;
        };
      };
    };

    alert(
      error.response?.data?.message ||
      "Failed to create case"
    );
  }
};

  // ================= DELETE =================
  const handleDelete = async (id: string) => {
    try {
      await api.post("/users/DeleteCase", { caseId: id });
      setCases(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // ================= EDIT =================
  const handleEdit = (item: CaseType) => {
    setEditCase(item);

    setForm({
      caseCode: item.caseCode,
      clientId: item.client?._id || "",
      projectTitle: item.projectTitle,
      nextHearing: item.nextHearing,
      caseStatus: item.caseStatus,
      totalBilled: ""
    });

    setShowModal(true);
  };

  // ================= UPDATE =================
  const handleUpdateCase = async () => {
    try {
      if (!editCase) return;

      const res = await api.post("/users/UpdateCase", {
        caseId: editCase._id,
        projectTitle: form.projectTitle,
        nextHearing: form.nextHearing,
        caseStatus: form.caseStatus
      });

      if (res.data.status === "success") {
        setShowModal(false);
        setEditCase(null);
        resetForm();
        reloadCases();
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const reloadCases = async () => {
    const refreshed = isAdminUser
      ? await api.get("/users/GetAllCases")
      : isClientUser
      ? await api.get("/users/GetMyCases")
      : await api.get("/users/GetLawyerCases");

    setCases(refreshed.data.data);
  };

  const handleView = (id: string) => {
    router.push(`/dashboard/cases/${id}`);
  };

  const resetForm = () => {
    setForm({
      caseCode: "",
      clientId: "",
      projectTitle: "",
      nextHearing: "",
      caseStatus: "Ongoing",
      totalBilled: ""
    });
  };

  // ================= FILTER =================
  const filteredCases = cases.filter((c) =>
    c.caseCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.client?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.lawyer?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCases = filteredCases.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredCases.length / itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ongoing": return "bg-blue-100 text-blue-700";
      case "Hearing": return "bg-orange-100 text-orange-700";
      case "Closed": return "bg-slate-100 text-slate-700";
      case "Notice": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100";
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Case Management</h2>

        {!isClientUser && (
          <Button onClick={() => {
            setEditCase(null);
            resetForm();
            setShowModal(true);
          }}>
            <Plus className="h-4 w-4" /> New Case
          </Button>
        )}
      </div>

      {/* SEARCH */}
      <Input
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
      />

      {/* TABLE */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Case Code</TableHead>
            <TableHead>{isClientUser ? "Lawyer" : "Client"}</TableHead>
            {isAdminUser && <TableHead>Lawyer</TableHead>}
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {paginatedCases.map((item) => (
            <TableRow key={item._id}>
              <TableCell>{item.caseCode}</TableCell>

              <TableCell>
                {isClientUser
                  ? item.lawyer?.fullName
                  : item.client?.fullName}
              </TableCell>

              {isAdminUser && (
                <TableCell>{item.lawyer?.fullName}</TableCell>
              )}

              <TableCell>{item.projectTitle}</TableCell>

              <TableCell>
                <Badge className={getStatusColor(item.caseStatus)}>
                  {item.caseStatus}
                </Badge>
              </TableCell>

              <TableCell>{item.nextHearing}</TableCell>

              <TableCell className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => handleView(item._id)}>
                  View
                </Button>

                {!isClientUser && (
                  <Button size="sm" onClick={() => handleEdit(item)}>
                    Edit
                  </Button>
                )}

                <Button size="sm" variant="destructive" onClick={() => handleDelete(item._id)}>
                  Delete
                </Button>
              </TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-3 mt-4">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
        >
          Prev
        </Button>

        <span className="text-sm">
          Page {currentPage} of {totalPages || 1}
        </span>

        <Button
          variant="outline"
          disabled={currentPage >= totalPages}
          onClick={() => setCurrentPage(prev => prev + 1)}
        >
          Next
        </Button>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96 space-y-4">

            <h3 className="font-bold text-lg">
              {editCase ? "Edit Case" : "Create Case"}
            </h3>

            {!editCase && (
              <Input
                placeholder="Case Code"
                value={form.caseCode}
                onChange={(e) =>
                  setForm({ ...form, caseCode: e.target.value })
                }
              />
            )}

            <select
              className="w-full border p-2 rounded"
              value={form.clientId}
              onChange={(e) =>
                setForm({ ...form, clientId: e.target.value })
              }
            >
              <option value="">Select Client</option>
              {clients.map(c => (
                <option key={c._id} value={c._id}>
                  {c.fullName} ({c.email})
                </option>
              ))}
            </select>

            <Input
              placeholder="Case Type"
              value={form.projectTitle}
              onChange={(e) =>
                setForm({ ...form, projectTitle: e.target.value })
              }
            />

            <Input
              placeholder="Total Amount (₹)"
              type="number"
              value={form.totalBilled}
              onChange={(e) =>
                setForm({ ...form, totalBilled: e.target.value })
              }
            />

            <Input
              placeholder="Next Hearing"
              value={form.nextHearing}
              onChange={(e) =>
                setForm({ ...form, nextHearing: e.target.value })
              }
            />

            <select
              className="w-full border p-2 rounded"
              value={form.caseStatus}
              onChange={(e) =>
                setForm({ ...form, caseStatus: e.target.value })
              }
            >
              <option value="Ongoing">Ongoing</option>
              <option value="Hearing">Hearing</option>
              <option value="Closed">Closed</option>
              <option value="Notice">Notice</option>
            </select>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>

              {editCase ? (
                <Button onClick={handleUpdateCase}>Update</Button>
              ) : (
                <Button onClick={handleCreateCase}>Create</Button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}   