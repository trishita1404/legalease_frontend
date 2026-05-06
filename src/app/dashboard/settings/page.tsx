"use client";

import React, { useState, useRef, ChangeEvent, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Save, Loader2, Camera } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/axios"; 
import { toast } from "sonner";

export default function SettingsPage() {
  const { user, updateUser, token } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const BACKEND_URL = "https://legalease-backend-d2yt.onrender.com";

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    barId: "",
    specialization: "",
    bio: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  //  FETCH PROFILE (FIXED)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/me"); 

        if (res.data.status === "success") {
          updateUser(res.data.data);

          setFormData({
            fullName: res.data.data.fullName || "",
            phoneNumber: res.data.data.phoneNumber || "",
            barId: res.data.data.barId || "",
            specialization: res.data.data.specialization || "",
            bio: res.data.data.bio || "",
          });
        }
      } catch (err) {
        console.error("Profile fetch error", err);
      }
    };

    if (token) fetchProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  //  prevent blank screen
  if (!user) {
    return <div className="p-6">Loading...</div>;
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);

    try {
      const data = new FormData();

      data.append("fullName", formData.fullName);
      data.append("phoneNumber", formData.phoneNumber);
      data.append("barId", formData.barId);
      data.append("specialization", formData.specialization);
      data.append("bio", formData.bio);

      if (selectedFile) {
        data.append("avatar", selectedFile);
      }

      const response = await api.patch(
        "/users/update-profile", 
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === "success") {
        updateUser(response.data.data);
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      }

    } catch (error: unknown) {
  const err = error as {
    response?: {
      data?: {
        message?: string;
      };
    };
  };

  toast.error(err.response?.data?.message || "Failed to update profile");
}
  };

  const avatarSrc =
    previewUrl ||
    (user.avatar ? `${BACKEND_URL}${user.avatar}` : undefined);

  return (
    <div className="space-y-6 pb-10">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold text-primary">Settings</h2>
        <p className="text-muted-foreground text-sm">Manage your account.</p>
      </div>

      {/* PROFILE */}
      <Card>
        <CardHeader>
          <CardTitle>Public Profile</CardTitle>
          <CardDescription>Update your details</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">

          {/* Avatar */}
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatarSrc} />
              <AvatarFallback>
                {user.fullName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>

            {isEditing && (
              <>
                <input hidden ref={fileInputRef} type="file" onChange={handleFileChange} />
                <Button onClick={() => fileInputRef.current?.click()}>
                  <Camera className="mr-2 h-4 w-4" /> Change Photo
                </Button>
              </>
            )}
          </div>

          {/* Fields */}
          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <Label>Full Name</Label>
              {isEditing ? (
                <Input id="fullName" value={formData.fullName} onChange={handleChange} />
              ) : (
                <p>{user.fullName}</p>
              )}
            </div>

            <div>
              <Label>Email</Label>
              <Input value={user.email} disabled />
            </div>

            <div>
              <Label>Phone Number</Label>
              {isEditing ? (
                <Input id="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
              ) : (
                <p>{user.phoneNumber}</p>
              )}
            </div>

            {user.role === "lawyer" && (
              <>
                <div>
                  <Label>Bar ID</Label>
                  {isEditing ? (
                    <Input id="barId" value={formData.barId} onChange={handleChange} />
                  ) : (
                    <p>{user.barId}</p>
                  )}
                </div>

                <div>
                  <Label>Specialization</Label>
                  {isEditing ? (
                    <Input id="specialization" value={formData.specialization} onChange={handleChange} />
                  ) : (
                    <p>{user.specialization}</p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Bio */}
          <div>
            <Label>Bio</Label>
            {isEditing ? (
              <textarea
                id="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            ) : (
                <p>{user.bio}</p>
            )}
          </div>

          {/* Save */}
          <div className="pt-4 flex gap-3">
            {isEditing ? (
              <Button onClick={handleSaveProfile} disabled={loading}>
                {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
                Save Changes
              </Button>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>

        </CardContent>
      </Card>
    </div>
  );
}