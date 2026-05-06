"use client";

import { 
  LayoutDashboard, 
  Briefcase, 
  MessageSquare, 
  Calendar, 
  Settings, 
  FileText,
  Scale,
  Users,
  ShieldCheck,
  History,
  Megaphone
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { UserCheck } from "lucide-react";

export function AppSidebar() {
  const { user } = useAuthStore();
  const role = user?.role?.toLowerCase() || "lawyer";

  const menuConfig = {
  lawyer: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "My Cases", url: "/dashboard/cases", icon: Briefcase },
     { title: "Client Requests", url: "/dashboard/requests", icon: Users },
    { title: "Payment History", url: "/dashboard/payments", icon: History },
    { title: "Documents", url: "/dashboard/documents", icon: FileText },
    { title: "Messages", url: "/dashboard/messages", icon: MessageSquare },
    { title: "Calendar", url: "/dashboard/calendar", icon: Calendar },
    { title: "Announcements", url: "/dashboard/announcements", icon: Megaphone },
    { title: "Settings", url: "/dashboard/settings", icon: Settings },
  ],
  client: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "My Case Status", url: "/dashboard/cases", icon: Briefcase },
    { title: "Payments", url: "/dashboard/payments", icon: FileText },
    { title: "Shared Docs", url: "/dashboard/documents", icon: FileText },
    { title: "Chat with Lawyer", url: "/dashboard/messages", icon: MessageSquare },
    { title: "Appointments", url: "/dashboard/appointments", icon: Calendar },
    { title: "Calendar", url: "/dashboard/calendar", icon: Calendar },
    { title: "Announcements", url: "/dashboard/announcements", icon: Megaphone },
    { title: "Profile", url: "/dashboard/settings", icon: Settings },
  ],
  admin: [
    { title: "Admin Overview", url: "/dashboard", icon: ShieldCheck },
    { title: "Lawyer Requests", url: "/dashboard/lawyer-requests", icon: UserCheck },
    { title: "User Management", url: "/dashboard/users", icon: Users },
    { title: "System Logs", url: "/dashboard/logs", icon: History },
    { title: "All Cases", url: "/dashboard/cases", icon: Briefcase },
    { title: "Payment History", url: "/dashboard/payments", icon: History },
    { title: "Calendar", url: "/dashboard/calendar", icon: Calendar },
    { title: "Announcements", url: "/dashboard/announcements", icon: Megaphone },
    // { title: "Settings", url: "/dashboard/settings", icon: Settings },
  ]
};

  const items = menuConfig[role as keyof typeof menuConfig] || menuConfig.lawyer;

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-200">
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2 px-2">
          <Scale className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold text-primary group-data-[collapsible=icon]:hidden">
            LegalEase+
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {/* Increased margin bottom for the label */}
          <SidebarGroupLabel className="capitalize mb-4 text-xs font-semibold tracking-widest text-slate-500">
            {role} Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {/* Added gap-2 to separate menu items vertically */}
            <SidebarMenu className="gap-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {/* Added h-12 for height, py-6 for internal padding, and text-base for font size */}
                  <SidebarMenuButton 
                    asChild 
                    tooltip={item.title}
                    className="h-11 px-4 text-base font-medium transition-all hover:bg-slate-100 [&>svg]:size-5"
                  >
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}