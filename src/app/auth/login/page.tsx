"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Scale, ArrowLeft, Loader2, Lock, Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/useAuthStore";

interface ApiError {
  response?: {
    data?: {
      message?: string; 
    };
  };
}

export default function LoginPage() {
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
      password,
    });

    if (response.data.status === "success") {
      const accessToken = response.data.accessToken;

      // 🔥 STEP 1: get basic user
      // const basicUser = response.data.data;

      // 🔥 STEP 2: fetch FULL profile from DB
      const profileRes = await api.get("/users/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const userData = profileRes.data.data;

      // 🔥 STEP 3: store full data
      const formattedUser = {
        id: userData._id,
        fullName: userData.fullName || "",
        email: userData.email || "",
        role: userData.role || "",
        avatar: userData.avatar || "",
        phoneNumber: userData.phoneNumber || "",
        barId: userData.barId || "",
        specialization: userData.specialization || "",
        bio: userData.bio || "",
      };

      setAuth(formattedUser, accessToken);
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
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center bg-slate-50/50 px-4">
      <Link 
        href="/" 
        className="mb-8 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Landing Page
      </Link>

      <Card className="w-full max-w-md border-none shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Scale className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">Welcome Back</CardTitle>
          <CardDescription>
            Enter your credentials to access your LegalEase+ account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
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
                  className="pl-10 h-11 border-2 focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
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
                  className="pl-10 h-11 border-2 focus-visible:ring-primary"
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

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-primary font-semibold hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}