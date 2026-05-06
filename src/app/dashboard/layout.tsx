"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { UserNav } from "@/components/dashboard/UserNav";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuthStore } from "@/store/useAuthStore"; 

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthStore();
  
  // Determine the header title based on user role
  const getPortalTitle = () => {
    const role = user?.role?.toLowerCase();
    switch (role) {
      case "admin":
        return "LegalEase+ Administrator Console";
      case "client":
        return "LegalEase+ Client Portal";
      case "lawyer":
      default:
        return "LegalEase+ Management Portal";
    }
  };

  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-slate-50/50">
          <AppSidebar />
          
          <main className="flex-1 flex flex-col min-w-0">
            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-6 backdrop-blur">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div className="h-6 w-px bg-border hidden md:block" />
                <h1 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider hidden md:block">
                  {getPortalTitle()} {/* Dynamic Title */}
                </h1>
              </div>
              <UserNav />
            </header>

            <div className="flex-1 overflow-y-auto p-4 md:p-8">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}