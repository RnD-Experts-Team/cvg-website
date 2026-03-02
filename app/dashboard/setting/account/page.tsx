"use client";

import { Button } from "@/app/dashboard/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/dashboard/components/ui/card";
import { Input } from "@/app/dashboard/components/ui/input";
import { Label } from "@/app/dashboard/components/ui/label";
import { Separator } from "@/app/dashboard/components/ui/separator";
import * as React from "react";
import { toast } from "react-toastify";
import { HttpClient } from "@/app/lib/http/http-client";
import { getAuthToken } from "@/app/lib/http/auth";
import { HttpError } from "@/app/lib/http/errors";
import { useAuthStore } from "@/app/dashboard/stores/auth.store";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { ConfirmDialog } from "@/app/dashboard/components/ui/confirm-dialog";

export default function AccountPage() {
  const authUser = useAuthStore((s) => s.user);

  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);

  const token = useAuthStore((s) => s.token);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword.trim() || !confirmPassword.trim()) {
      const m = "New password and confirmation are required.";
      toast.error(m);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const client = new HttpClient({
        baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "",
        getToken: getAuthToken,
      });

      // Payload: include password and confirmation. Optionally include current password if backend expects it.
      const payload: any = {
        password: newPassword,
        password_confirmation: confirmPassword,
      };

      // If current password was provided, send it as current_password (some backends expect it).
      if (currentPassword) payload.current_password = currentPassword;

      const res = await client.post<{
        success: boolean;
        data: any;
        message?: string;
      }>("/auth/updateUser", payload, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const msg = (res as any)?.message ?? "Password updated successfully";
      toast.success(msg);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof HttpError) {
        const details = err.details as { message?: string } | undefined;
        toast.error(details?.message ?? `Update failed (${err.status})`);
      } else if ((err as any)?.isAxiosError) {
        toast.error(`Network error: ${(err as any).message}`);
      } else {
        toast.error("Failed to update password. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6" style={{ padding: 32 }}>
      <div>
        <h3 className="text-lg font-medium">Account Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account information and security settings
        </p>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder={
                  authUser?.email
                    ? "Enter current password"
                    : "Current password"
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Actions in this section are irreversible
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Delete Account</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data.
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() => setShowConfirmDialog(true)}
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </CardContent>
      </Card>

      
      {showConfirmDialog && (
        <ConfirmDialog
          message="Are you sure you want to log out and remove all your data from this device?"
          onConfirm={async () => {
            // handleLogout logic
            try {
              setLoading(true);

              const client = new HttpClient({
                baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "",
                getToken: () => token,
              });

              await client.logout();
              toast.success("Logged out successfully");
            } catch (err) {
              console.warn("Logout API failed, continuing cleanup...", err);
            } finally {
              setLoading(false);

              Cookies.remove("auth_token");
              try {
                localStorage.removeItem("auth_user");
              } catch {}
              logout();

              router.replace("/login");
            }
          }}
          onCancel={() => setShowConfirmDialog(false)}
        />
      )}
    </div>
  );
}
