"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Gavel,
  User,
  Mail,
  Fingerprint,
  Lock,
  Loader2,
  Phone
} from "lucide-react";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function RegisterForm({
  role,
  onSuccess
}: {
  role: "lawyer" | "client";
  onSuccess?: () => void;
}) {

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    identification: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setLoading(true);

    setError("");

    const normalizedEmail =
      formData.email.toLowerCase().trim();

    try {

      const response = await api.post(
        "/users/registration",
        {
          fullName: formData.fullName,
          email: normalizedEmail,
          password: formData.password,
          phone: formData.phone,
          identification: formData.identification,
          role: role,
        }
      );

      if (response.data.status === "success") {

        // SUCCESS CALLBACK
        if (onSuccess) {
          onSuccess();
        }
      }

    } catch (err: unknown) {

      const apiErr = err as ApiError;

      setError(
        apiErr.response?.data?.message ||
        "Registration failed. Please try again."
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {error && (
        <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-lg border border-destructive/20 text-center font-medium animate-in fade-in zoom-in duration-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <div className="space-y-2">
          <Label
            htmlFor="fullName"
            className="text-xs uppercase tracking-wider font-bold text-muted-foreground"
          >
            Full Name
          </Label>

          <div className="relative">

            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/60" />

            <Input
              id="fullName"
              name="fullName"
              placeholder="John Doe"
              className="pl-10 h-11 border-border focus-visible:ring-primary"
              required
              value={formData.fullName}
              onChange={handleChange}
            />

          </div>
        </div>

        <div className="space-y-2">

          <Label
            htmlFor="email"
            className="text-xs uppercase tracking-wider font-bold text-muted-foreground"
          >
            Email Address
          </Label>

          <div className="relative">

            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/60" />

            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              className="pl-10 h-11 border-border focus-visible:ring-primary"
              required
              value={formData.email}
              onChange={handleChange}
            />

          </div>
        </div>
      </div>

      <div className="space-y-2">

        <Label
          htmlFor="password"
          className="text-xs uppercase tracking-wider font-bold text-muted-foreground"
        >
          Password
        </Label>

        <div className="relative">

          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/60" />

          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            className="pl-10 h-11 border-border focus-visible:ring-primary"
            required
            value={formData.password}
            onChange={handleChange}
          />

        </div>
      </div>

      <div className="space-y-2">

        <Label
          htmlFor="identification"
          className="text-xs uppercase tracking-wider font-bold text-muted-foreground"
        >
          {role === "lawyer"
            ? "Bar Council ID"
            : "National ID / Aadhaar"}
        </Label>

        <div className="relative">

          {role === "lawyer" ? (
            <Gavel className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/60" />
          ) : (
            <Fingerprint className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/60" />
          )}

          <Input
            id="identification"
            name="identification"
            placeholder={
              role === "lawyer"
                ? "WB/1234/2024"
                : "Enter ID Number"
            }
            className="pl-10 h-11 border-border focus-visible:ring-primary"
            required
            value={formData.identification}
            onChange={handleChange}
          />

        </div>
      </div>

      <div className="space-y-2">

        <Label
          htmlFor="phone"
          className="text-xs uppercase tracking-wider font-bold text-muted-foreground"
        >
          Phone Number
        </Label>

        <div className="relative">

          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/60" />

          <span className="absolute left-10 top-3 text-sm font-medium text-muted-foreground">
            +91
          </span>

          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="9876543210"
            className="pl-20 h-11 border-border focus-visible:ring-primary"
            required
            value={formData.phone}
            onChange={handleChange}
          />

        </div>
      </div>

      <Button
        type="submit"
        className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20 mt-2"
        disabled={loading}
      >

        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Finalizing...
          </>
        ) : (
          `Complete ${role.charAt(0).toUpperCase() + role.slice(1)} Signup`
        )}

      </Button>
    </form>
  );
}