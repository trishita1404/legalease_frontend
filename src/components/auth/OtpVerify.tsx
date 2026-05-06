"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function OtpVerify({
  email,
  onSuccess,
}: {
  email: string;
  onSuccess?: () => void;
}) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false); // ✅ NEW STATE

  const router = useRouter();
  const { setAuth } = useAuthStore();

  const handleVerify = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/users/verify-otp", {
        email: email.toLowerCase().trim(),
        otp: otp.trim(),
      });

      //  HANDLE PENDING LAWYER
      if (response.data.status === "pending") {
        setIsPending(true);
        return;
      }

      //  SUCCESS FLOW
      if (response.data.status === "success") {
        localStorage.removeItem("emailForVerify");

        const userData = response.data.data;
        const accessToken = response.data.accessToken;

        const formattedUser = {
          id: userData._id || userData.id,
          fullName: userData.fullName,
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
      setError(
        apiErr.response?.data?.message ||
          "Verification failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  //  WAITING SCREEN UI
  // =========================
  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-6 text-center animate-in fade-in zoom-in duration-300">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">
            Waiting for Admin Approval
          </h3>
          <p className="text-sm text-muted-foreground">
            Your account has been verified.
            <br />
            Please wait until the admin approves your request.
          </p>
        </div>
      </div>
    );
  }

  // =========================
  //  NORMAL OTP UI
  // =========================
  return (
    <div className="flex flex-col items-center space-y-6 py-2 animate-in fade-in zoom-in duration-300">
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground leading-relaxed">
          We have sent a 6-digit verification code to <br />
          <span className="font-semibold text-foreground italic underline underline-offset-4">
            {email}
          </span>
        </p>
      </div>

      {error && (
        <div className="w-full text-sm font-medium text-destructive text-center bg-destructive/10 p-3 rounded-xl border border-destructive/20 animate-in shake duration-300">
          {error}
        </div>
      )}

      <div className="py-4">
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={(value) => setOtp(value)}
          disabled={loading}
        >
          <InputOTPGroup className="gap-2 sm:gap-3">
            {[...Array(6)].map((_, i) => (
              <InputOTPSlot
                key={i}
                index={i}
                className="rounded-xl border-2 h-12 w-10 sm:h-14 sm:w-12 text-xl font-bold border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>

      <div className="w-full space-y-4">
        <Button
          onClick={handleVerify}
          className="w-full h-12 text-base font-bold shadow-xl shadow-primary/20 rounded-xl"
          disabled={otp.length !== 6 || loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <ShieldCheck className="mr-2 h-5 w-5" />
              Verify & Get Started
            </>
          )}
        </Button>

        <div className="text-center">
          <button
            type="button"
            className="text-sm text-muted-foreground hover:text-primary font-medium transition-colors"
            disabled={loading}
            onClick={() => alert("A new code has been requested.")}
          >
            Didn&apos;t receive a code?{" "}
            <span className="text-primary underline underline-offset-4">
              Resend
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}