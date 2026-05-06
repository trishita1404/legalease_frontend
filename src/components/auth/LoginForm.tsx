"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock, Mail } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

interface ApiError {
  response?: { data?: { message?: string } };
}

export function LoginForm({ onSuccess }: { onSuccess?: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const cleanEmail = email.toLowerCase().trim();

    try {
      const response = await api.post("/users/login", {
        email: cleanEmail,
        password: password,
      });

      if (response.data.status === "success") {
        const userData = response.data.data;
        const accessToken = response.data.accessToken;

        // ✅ FIXED HERE
        const formattedUser = {
          id: userData.id || userData._id,
          fullName: userData.fullName,   // 🔥 correct key
          email: userData.email,
          role: userData.role,
          avatar: userData.avatar || "",
        };

        setAuth(formattedUser, accessToken);

        if (onSuccess) onSuccess();
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setError(apiErr.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4 pt-4">
      {error && (
        <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-lg border border-destructive/20 text-center font-medium animate-in fade-in zoom-in duration-300">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="admin@legalease.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="pl-10 h-11 border-border focus-visible:ring-primary"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="pl-10 h-11 border-border focus-visible:ring-primary"
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full h-11 text-base font-semibold shadow-lg shadow-primary/20"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </Button>
    </form>
  );
}