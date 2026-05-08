// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { Mail, ArrowLeft } from "lucide-react";
// import OtpVerify from "@/components/auth/OtpVerify";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// export default function VerifyOTPPage() {
//   const router = useRouter();
  
//   // 1. Initializing state via a function avoids the effect-based "cascading render"
//   // We check for window to prevent SSR errors during the build phase.
//   const [email] = useState<string | null>(() => {
//     if (typeof window !== "undefined") {
//       return localStorage.getItem("emailForVerify");
//     }
//     return null;
//   });

//   // 2. Use the effect only for navigation (external system synchronization)
//   useEffect(() => {
//     if (!email) {
//       router.push("/auth/register");
//     }
//   }, [email, router]);

//   // 3. We use a simple conditional check for rendering. 
//   // If email is null (initial server state), we return null to avoid hydration mismatch.
//   if (typeof window === "undefined" || !email) return null;

//   return (
//     <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center bg-slate-50/50 px-4 py-12">
//       <button 
//         onClick={() => router.push("/auth/register")}
//         className="mb-8 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
//       >
//         <ArrowLeft className="h-4 w-4" />
//         Back to Registration
//       </button>

//       <Card className="w-full max-w-md border-none shadow-xl">
//         <CardHeader className="text-center pb-2">
//           <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
//             <Mail className="h-7 w-7" />
//           </div>
//           <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
//             Verify your email
//           </CardTitle>
//           <CardDescription className="text-base mt-2 px-6">
//             Enter the 6-digit security code we sent to: <br/>
//             <span className="font-semibold text-slate-900 italic">{email}</span>
//           </CardDescription>
//         </CardHeader>
        
//         <CardContent className="pt-6">
//           <OtpVerify email={email} />
//         </CardContent>
//       </Card>
//     </div>
//   );
// }