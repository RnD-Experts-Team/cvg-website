"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BellIcon,
  CreditCardIcon,
  LogOutIcon,
  MoreVerticalIcon,
  UserCircleIcon,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/dashboard/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/dashboard/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/app/dashboard/components/ui/sidebar";
import { ConfirmDialog } from "@/app/dashboard/components/ui/confirm-dialog"; // Importing ConfirmDialog
import { HttpClient } from "@/app/lib/http/http-client";
import { HttpError } from "@/app/lib/http/errors";
import { toast } from "react-toastify";
import { useAuthStore } from "@/app/dashboard/stores/auth.store";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const router = useRouter();
  const authLogout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (token) {
        // call server to invalidate token
        const client = new HttpClient({
          baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://cvg.pnehomes.com/api",
          getToken: () => token,
        });

        const response = await client.logout<{ success: boolean; data?: any; message?: string }>();

        // backend returned a success flag; optionally show message
        if (response?.success) {
          // remove token locally
          localStorage.removeItem("auth_token");
          toast.success(response.message || "Logged out successfully");
        } else {
          console.warn("Logout response did not indicate success", response);
          toast.warn("Unexpected logout response");
        }
      } else {
        // no token available, just consider user logged out
        toast.info("No session found, redirecting to login");
      }
    } catch (err) {
      // treat 401 as already logged out/unauthenticated
      if (err instanceof HttpError && err.status === 401) {
        toast.info("Session expired, redirecting to login...");
      } else {
        console.error("Logout failed", err);
        toast.error("Logout failed. Please try again.");
      }
    } finally {
      // clear client state regardless of server response
      authLogout();
      router.push("/login");
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
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
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
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <UserCircleIcon />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCardIcon />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BellIcon />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
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