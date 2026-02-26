"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import {
  LogOutIcon,
  MoreVerticalIcon,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
} from "@/app/dashboard/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/app/dashboard/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/app/dashboard/components/ui/sidebar";
import { ConfirmDialog } from "@/app/dashboard/components/ui/confirm-dialog";
import { HttpClient } from "@/app/lib/http/http-client";
import { toast } from "react-toastify";
import { useAuthStore } from "@/app/dashboard/stores/auth.store";

export function NavUser() {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, token, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      setLoading(true);

      const client = new HttpClient({
        baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "",
        getToken: () => token,
      });

      await client.logout();
      toast.success("Logged out successfully");
    } catch {
      console.warn("Logout API failed, continuing cleanup...");
    } finally {
      setLoading(false);

      Cookies.remove("auth_token");
      logout();

      router.replace("/login");
    }
  };

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg grayscale">
                  <AvatarFallback className="rounded-lg">
                    {user?.email?.charAt(0).toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-xs text-muted-foreground">
                    {user?.email ?? ""}
                  </span>
                </div>

                <MoreVerticalIcon className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg">
                      {user?.email?.charAt(0).toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate text-xs text-muted-foreground">
                      {user?.email ?? ""}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuItem onClick={() => setShowConfirmDialog(true)}>
                <LogOutIcon />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      {showConfirmDialog && (
        <ConfirmDialog
          message="Are you sure you want to log out?"
          onConfirm={handleLogout}
          onCancel={() => setShowConfirmDialog(false)}
        />
      )}
    </>
  );
}