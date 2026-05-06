"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

//  NEW IMPORT
import NotificationBell from "@/components/dashboard/NotificationBell";

export function UserNav() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const BACKEND_URL = "https://legalease-backend-d2yt.onrender.com";

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  //  Safe values
  const name = user?.fullName || "User";
  const email = user?.email || "user@example.com";

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const avatarUrl =
    user?.avatar && user.avatar !== ""
      ? `${BACKEND_URL}${user.avatar}`
      : undefined;

  return (
    <div className="flex items-center gap-3">
      {/* 🔔 Notification Bell */}
      <NotificationBell />

      {/* 👤 User Avatar Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-10 w-10 rounded-full border-2 border-primary/10"
          >
            <Avatar className="h-9 w-9">
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback className="bg-primary/5 text-primary font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-bold leading-none">{name}</p>
              <p className="text-xs leading-none text-muted-foreground italic uppercase">
                {user?.role || "User"}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {email}
              </p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/settings")}
            >
              Profile Settings
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>

            <DropdownMenuItem disabled>
              Phone: {user?.phoneNumber ? user.phoneNumber : "Not added"}
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleLogout}
            className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
          >
            Log out
            <DropdownMenuShortcut>Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
