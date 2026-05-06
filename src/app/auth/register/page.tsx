"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Gavel, User, CheckCircle2 } from "lucide-react";
import RegisterForm from "@/components/auth/RegisterForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<"lawyer" | "client" | null>(null);
  const router = useRouter();

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center bg-slate-50/50 px-4 py-12">
      {/* Navigation Back Link */}
      <button 
        onClick={() => (step === 2 ? setStep(1) : router.push("/"))}
        className="mb-8 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {step === 1 ? "Back to Home" : "Back to Role Selection"}
      </button>

      <Card className="w-full max-w-2xl border-none shadow-xl transition-all duration-500 overflow-hidden">
        <CardHeader className="text-center pb-2 pt-8">
          <CardTitle className="text-3xl font-bold tracking-tight">
            {step === 1 ? "Create your account" : "Complete Registration"}
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            {step === 1 
              ? "Select your role to get started with LegalEase+" 
              : `Fill in your details to join as a ${role}`}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-8">
          {step === 1 ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Lawyer Card */}
                <button
                  onClick={() => setRole("lawyer")}
                  className={`relative flex flex-col items-center p-8 rounded-2xl border-2 transition-all text-center group ${
                    role === "lawyer" 
                      ? "border-primary bg-primary/5 shadow-md ring-1 ring-primary/20" 
                      : "border-slate-200 hover:border-primary/50 bg-card"
                  }`}
                >
                  <div className={`mb-4 rounded-full p-4 transition-colors ${role === "lawyer" ? "bg-primary text-white" : "bg-secondary text-primary group-hover:bg-primary/10"}`}>
                    <Gavel className="h-8 w-8" />
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-slate-900">I am a Lawyer</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">Manage your practice and cases securely.</p>
                  {role === "lawyer" && <CheckCircle2 className="absolute top-4 right-4 h-6 w-6 text-primary animate-in zoom-in" />}
                </button>

                {/* Client Card */}
                <button
                  onClick={() => setRole("client")}
                  className={`relative flex flex-col items-center p-8 rounded-2xl border-2 transition-all text-center group ${
                    role === "client" 
                      ? "border-primary bg-primary/5 shadow-md ring-1 ring-primary/20" 
                      : "border-slate-200 hover:border-primary/50 bg-card"
                  }`}
                >
                  <div className={`mb-4 rounded-full p-4 transition-colors ${role === "client" ? "bg-primary text-white" : "bg-secondary text-primary group-hover:bg-primary/10"}`}>
                    <User className="h-8 w-8" />
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-slate-900">I am a Client</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">Find legal help and track your cases.</p>
                  {role === "client" && <CheckCircle2 className="absolute top-4 right-4 h-6 w-6 text-primary animate-in zoom-in" />}
                </button>
              </div>

              <Button 
                size="lg" 
                className="w-full h-12 text-base font-semibold transition-all" 
                disabled={!role} 
                onClick={() => setStep(2)}
              >
                Continue as {role ? role.charAt(0).toUpperCase() + role.slice(1) : "..." }
              </Button>
            </div>
          ) : (
            // Render the Form Component once Role is selected
            <RegisterForm role={role as "lawyer" | "client"} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}