"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

import {
  FileText,
  UploadCloud,
  Download,
  Trash2,
  ShieldCheck,
} from "lucide-react";

interface DocType {
  _id?: string;
  fileName: string;
  fileUrl: string;
  fileType?: string;
  status?: string;
  uploadedAt?: string;
}

// ===============================
// MAIN PAGE
// ===============================
export default function DocumentsPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <DocumentsContent />
    </Suspense>
  );
}

// ===============================
// CONTENT
// ===============================
function DocumentsContent() {

  const searchParams = useSearchParams();

  const { selectedCase, user } = useAuthStore();

  const caseId =
    selectedCase?._id || searchParams.get("caseId");

  const isLawyer = user?.role === "lawyer";

  const [docs, setDocs] = useState<DocType[]>([]);
  const [file, setFile] = useState<File | null>(null);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ===============================
  // FETCH DOCS
  // ===============================
  useEffect(() => {

    if (!caseId) return;

    const fetchDocs = async () => {
      try {

        const res = await api.get(
          `/users/GetCaseById/${caseId}`
        );

        if (res.data.status === "success") {
          setDocs(res.data.data.documents || []);
        }

      } catch (err) {
        console.error(err);
      }
    };

    fetchDocs();

  }, [caseId]);

  // ===============================
  // FILE SELECT
  // ===============================
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  // ===============================
  // UPLOAD
  // ===============================
  const handleUpload = async () => {

    if (!file || !caseId) return;

    try {

      const formData = new FormData();

      formData.append("caseDoc", file);
      formData.append("caseId", caseId);
      formData.append("fileName", file.name);

      setUploading(true);

      await api.post(
        "/users/UploadCaseDocument",
        formData,
        {
          onUploadProgress: (e) => {
            const percent = Math.round(
              (e.loaded * 100) / (e.total || 1)
            );

            setProgress(percent);
          },
        }
      );

      setUploading(false);
      setProgress(0);
      setFile(null);

      // refresh
      const res = await api.get(
        `/users/GetCaseById/${caseId}`
      );

      setDocs(res.data.data.documents || []);

    } catch (err) {

      console.error(err);

      setUploading(false);
    }
  };

  // ===============================
  // DOWNLOAD
  // ===============================
  const handleDownload = (url: string) => {

  window.open(
    `https://legalease-backend-d2yt.onrender.com${url}`,
    "_blank"
  );
};

  // ===============================
  // DELETE
  // ===============================
  const handleDelete = async (
    fileUrl: string
  ) => {

    try {

      await api.post(
        "/users/DeleteDocument",
        {
          caseId,
          fileUrl,
        }
      );

      const res = await api.get(
        `/users/GetCaseById/${caseId}`
      );

      setDocs(res.data.data.documents || []);

    } catch (err) {
      console.error(err);
    }
  };

  // ===============================
  // STATUS CHANGE
  // ===============================
  const handleStatusChange = async (
    fileUrl: string,
    status: string
  ) => {

    try {

      await api.post(
        "/users/UpdateDocumentStatus",
        {
          caseId,
          fileUrl,
          status,
        }
      );

      const res = await api.get(
        `/users/GetCaseById/${caseId}`
      );

      setDocs(res.data.data.documents || []);

    } catch (err) {
      console.error(err);
    }
  };

  // ===============================
  // STATUS COLORS
  // ===============================
  const getStatusColor = (
    status?: string
  ) => {

    switch (status) {

      case "verified":
        return "bg-green-100 text-green-700";

      case "review":
        return "bg-orange-100 text-orange-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>

        <h2 className="text-2xl font-bold text-primary">
          Document Vault
        </h2>

        {selectedCase && (
          <p className="text-sm text-green-600 mt-1">
            Case: {selectedCase.caseCode}
          </p>
        )}

        <p className="text-muted-foreground text-sm flex items-center gap-1">
          <ShieldCheck className="h-3 w-3" />
          Secure Storage
        </p>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* UPLOAD */}
        <Card className="lg:col-span-1 border-dashed border-2">

          <CardContent className="pt-6 text-center space-y-4">

            <UploadCloud className="h-10 w-10 mx-auto text-primary" />

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              hidden
            />

            <Button
              onClick={() =>
                fileInputRef.current?.click()
              }
            >
              Select File
            </Button>

            {file && (
              <p className="text-sm text-green-600">
                {file.name}
              </p>
            )}

            <Button
              onClick={handleUpload}
              disabled={!file || uploading}
            >
              {uploading
                ? "Uploading..."
                : "Upload"}
            </Button>

            {uploading && (
              <Progress value={progress} />
            )}

          </CardContent>

        </Card>

        {/* DOCUMENTS */}
        <Card className="lg:col-span-2">

          <CardHeader>
            <CardTitle>
              Documents
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">

            <ScrollArea className="h-100">

              {docs.length === 0 ? (

                <p className="p-4 text-sm text-gray-500">
                  No documents
                </p>

              ) : (

                docs.map((doc, i) => (

                  <div
                    key={i}
                    className="p-4 border-b space-y-2"
                  >

                    <div className="flex justify-between items-center">

                      <div className="flex gap-2">

                        <FileText className="h-5 w-5" />

                        {doc.fileName}

                      </div>

                      <div className="flex gap-2 items-center">

                        <Badge
                          className={getStatusColor(doc.status)}
                        >
                          {doc.status || "pending"}
                        </Badge>

                        <Button
                          size="icon"
                          onClick={() =>
                            handleDownload(doc.fileUrl)
                          }
                        >
                          <Download className="h-4 w-4" />
                        </Button>

                        {isLawyer && (

                          <Button
                            size="icon"
                            onClick={() =>
                              handleDelete(doc.fileUrl)
                            }
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>

                        )}

                      </div>

                    </div>

                    {isLawyer && (

                      <div className="flex gap-2 flex-wrap">

                        <Button
                          size="sm"
                          onClick={() =>
                            handleStatusChange(
                              doc.fileUrl,
                              "verified"
                            )
                          }
                        >
                          Verify
                        </Button>

                        <Button
                          size="sm"
                          onClick={() =>
                            handleStatusChange(
                              doc.fileUrl,
                              "review"
                            )
                          }
                        >
                          Review
                        </Button>

                        <Button
                          size="sm"
                          onClick={() =>
                            handleStatusChange(
                              doc.fileUrl,
                              "pending"
                            )
                          }
                        >
                          Pending
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            handleStatusChange(
                              doc.fileUrl,
                              "rejected"
                            )
                          }
                        >
                          Reject
                        </Button>

                      </div>

                    )}

                  </div>
                ))
              )}

            </ScrollArea>

          </CardContent>

        </Card>

      </div>

    </div>
  );
}