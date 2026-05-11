"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import Link from "next/link";

import { Button } from "@/components/ui/button";

import {
  Scale,
  Gavel,
  User,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
  Loader2,
} from "lucide-react";

import { LoginForm } from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Navbar() {

  const pathname = usePathname();

const [isLoginOpen, setIsLoginOpen] = useState(false);

const [isRegisterOpen, setIsRegisterOpen] = useState(false);

const [regStep, setRegStep] = useState<1 | 2 | 3>(1);

const [selectedRole, setSelectedRole] = useState<
  "lawyer" | "client" | null
>(null);

// ✅ AFTER ALL HOOKS
if (pathname.startsWith("/dashboard")) {
  return null;
}

  // Reset registration state when closing dialog
  const handleRegisterOpenChange = (open: boolean) => {

    setIsRegisterOpen(open);

    if (!open) {

      setTimeout(() => {

        setRegStep(1);

        setSelectedRole(null);

      }, 300);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">

      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">

          <Scale className="h-6 w-6 text-primary transition-transform group-hover:rotate-12" />

          <span className="text-xl font-bold tracking-tight text-foreground">
            LegalEase<span className="text-primary">+</span>
          </span>

        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">

          <Link
            href="/#features"
            className="hover:text-primary transition-colors"
          >
            Features
          </Link>

          <Link
            href="/#how-it-works"
            className="hover:text-primary transition-colors"
          >
            How it Works
          </Link>

          <Link
            href="/#about"
            className="hover:text-primary transition-colors"
          >
            About
          </Link>

        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">

          {/* LOGIN DIALOG */}
          <Dialog
            open={isLoginOpen}
            onOpenChange={setIsLoginOpen}
          >

            <DialogTrigger asChild>

              <button className="text-sm font-medium hover:text-primary transition-colors">
                Sign In
              </button>

            </DialogTrigger>

            <DialogContent className="sm:max-w-100 border-none shadow-2xl">

              <DialogHeader className="items-center text-center">

                <div className="rounded-full bg-primary/10 p-3 mb-2">

                  <Scale className="h-6 w-6 text-primary" />

                </div>

                <DialogTitle className="text-2xl font-bold">
                  Welcome Back
                </DialogTitle>

                <DialogDescription>
                  Enter your credentials to access your account.
                </DialogDescription>

              </DialogHeader>

              <LoginForm
                onSuccess={() =>
                  setIsLoginOpen(false)
                }
              />

              <div className="mt-4 text-center text-sm text-muted-foreground">

                Don&apos;t have an account?{" "}

                <button
                  onClick={() => {

                    setIsLoginOpen(false);

                    setIsRegisterOpen(true);
                  }}
                  className="text-primary font-semibold hover:underline"
                >
                  Sign up
                </button>

              </div>

            </DialogContent>
          </Dialog>

          {/* REGISTER DIALOG */}
          <Dialog
            open={isRegisterOpen}
            onOpenChange={handleRegisterOpenChange}
          >

            <DialogTrigger asChild>

              <Button className="rounded-full px-6 shadow-lg shadow-primary/20">
                Get Started
              </Button>

            </DialogTrigger>

            <DialogContent className="sm:max-w-137.5 border-none shadow-2xl overflow-hidden p-0">

              <div className="p-8">

                {/* BACK BUTTON */}
                {regStep === 2 && (

                  <button
                    onClick={() =>
                      setRegStep(1)
                    }
                    className="mb-4 flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                  >

                    <ArrowLeft className="h-3 w-3" />

                    Back to Role Selection

                  </button>
                )}

                <DialogHeader className="items-center text-center mb-6">

                  <div className="rounded-full bg-primary/10 p-3 mb-2">

                    {regStep === 3 ? (

                      <ShieldCheck className="h-6 w-6 text-primary" />

                    ) : (

                      <Scale className="h-6 w-6 text-primary" />

                    )}

                  </div>

                  <DialogTitle className="text-2xl font-bold">

                    {regStep === 1 &&
                      "Create your account"}

                    {regStep === 2 &&
                      "Complete Registration"}

                    {regStep === 3 &&
                      "Approval Pending"}

                  </DialogTitle>

                  <DialogDescription>

                    {regStep === 1 &&
                      "Select your role to get started with LegalEase+"}

                    {regStep === 2 &&
                      `Joining as a ${selectedRole
                        ?.charAt(0)
                        .toUpperCase()}${selectedRole?.slice(1)}`}

                    {regStep === 3 &&
                      "Your registration was successful."}

                  </DialogDescription>

                </DialogHeader>

                {/* STEP 1 */}
                {regStep === 1 && (

                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                      {/* LAWYER */}
                      <button
                        onClick={() =>
                          setSelectedRole("lawyer")
                        }
                        className={`relative flex flex-col items-center p-6 rounded-xl border-2 transition-all text-center group ${
                          selectedRole === "lawyer"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >

                        <div
                          className={`mb-3 rounded-full p-3 ${
                            selectedRole === "lawyer"
                              ? "bg-primary text-white"
                              : "bg-secondary text-primary"
                          }`}
                        >

                          <Gavel className="h-6 w-6" />

                        </div>

                        <h3 className="font-bold">
                          Lawyer
                        </h3>

                        <p className="text-xs text-muted-foreground">
                          Manage your practice.
                        </p>

                        {selectedRole === "lawyer" && (

                          <CheckCircle2 className="absolute top-3 right-3 h-5 w-5 text-primary animate-in zoom-in" />

                        )}

                      </button>

                      {/* CLIENT */}
                      <button
                        onClick={() =>
                          setSelectedRole("client")
                        }
                        className={`relative flex flex-col items-center p-6 rounded-xl border-2 transition-all text-center group ${
                          selectedRole === "client"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >

                        <div
                          className={`mb-3 rounded-full p-3 ${
                            selectedRole === "client"
                              ? "bg-primary text-white"
                              : "bg-secondary text-primary"
                          }`}
                        >

                          <User className="h-6 w-6" />

                        </div>

                        <h3 className="font-bold">
                          Client
                        </h3>

                        <p className="text-xs text-muted-foreground">
                          Find legal help.
                        </p>

                        {selectedRole === "client" && (

                          <CheckCircle2 className="absolute top-3 right-3 h-5 w-5 text-primary animate-in zoom-in" />

                        )}

                      </button>

                    </div>

                    <Button
                      className="w-full h-11"
                      disabled={!selectedRole}
                      onClick={() =>
                        setRegStep(2)
                      }
                    >
                      Continue
                    </Button>

                  </div>
                )}

                {/* STEP 2 */}
                {regStep === 2 && (

                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">

                    <RegisterForm
                      role={
                        selectedRole as
                          | "lawyer"
                          | "client"
                      }

                      onSuccess={() => {

                        // CLIENT
                        if (
                          selectedRole ===
                          "client"
                        ) {

                          setIsRegisterOpen(false);

                          setIsLoginOpen(true);
                        }

                        // LAWYER
                        if (
                          selectedRole ===
                          "lawyer"
                        ) {

                          setRegStep(3);
                        }
                      }}
                    />

                  </div>
                )}

                {/* STEP 3 */}
                {regStep === 3 && (

                  <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in duration-300">

                    <div className="mb-6 rounded-full bg-primary/10 p-5">

                      <Loader2 className="h-10 w-10 text-primary animate-spin" />

                    </div>

                    <h3 className="text-2xl font-bold mb-3">
                      Waiting for Admin Approval
                    </h3>

                    <p className="text-muted-foreground max-w-md leading-relaxed">

                      Your lawyer account has been successfully registered.

                      Please wait while our admin reviews and approves your account.

                    </p>

                    <Button
                      className="mt-8"
                      onClick={() => {

                        setIsRegisterOpen(false);

                        setIsLoginOpen(true);
                      }}
                    >
                      Go to Login
                    </Button>

                  </div>
                )}

              </div>
            </DialogContent>
          </Dialog>

        </div>
      </div>
    </nav>
  );
}