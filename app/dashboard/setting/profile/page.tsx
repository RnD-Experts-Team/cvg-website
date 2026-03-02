"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/dashboard/components/ui/avatar";
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
import { Textarea } from "@/app/dashboard/components/ui/textarea";
import * as React from "react";
import { toast } from "react-toastify";
import { HttpClient } from "@/app/lib/http/http-client";
import { getAuthToken } from "@/app/lib/http/auth";
import { HttpError } from "@/app/lib/http/errors";
import { useAuthStore } from "@/app/dashboard/stores/auth.store";

// Provide a local default user so the route can prerender independently
const user = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "/avatars/shadcn.jpg",
};

export default function ProfilePage() {
  const authUser = useAuthStore((s) => s.user);

  const [name, setName] = React.useState<string>(() => {
    try {
      const raw =
        typeof window !== "undefined"
          ? localStorage.getItem("auth_user")
          : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed?.name || parsed?.fullName || user.name || "";
      }
    } catch {}
    return user.name;
  });

  const [title, setTitle] = React.useState<string>(() => {
    try {
      const raw =
        typeof window !== "undefined"
          ? localStorage.getItem("auth_user")
          : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed?.title || "";
      }
    } catch {}
    return "";
  });

  const [isSaving, setIsSaving] = React.useState(false);

  const [email, setEmail] = React.useState<string>(() => {
    try {
      const raw =
        typeof window !== "undefined"
          ? localStorage.getItem("auth_user")
          : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed?.email || authUser?.email || user.email || "";
      }
    } catch {}
    return authUser?.email || user.email || "";
  });

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsSaving(true);

    try {
      const client = new HttpClient({
        baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "",
        getToken: getAuthToken,
      });

      const payload: any = {
        name: name,
        email: email,
      };
      // include title if backend supports it
      if (title) payload.title = title;

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

      // update local storage / auth store if user object returned
      if ((res as any)?.data) {
        try {
          const raw = localStorage.getItem("auth_user");
          const parsed = raw ? JSON.parse(raw) : {};
          const merged = { ...parsed, ...(res as any).data };
          // ensure email/name/title reflect changes
          if (email) merged.email = email;
          if (name) merged.name = name;
          if (title) merged.title = title;
          localStorage.setItem("auth_user", JSON.stringify(merged));
          // update zustand store so UI updates across app
          try {
            // setState exists on the hook function
            (useAuthStore as any).setState({ user: merged });
          } catch {}
        } catch {}
      }

      const msg = (res as any)?.message ?? "Profile updated successfully";
      toast.success(msg);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof HttpError) {
        const details = err.details as { message?: string } | undefined;
        toast.error(details?.message ?? `Update failed (${err.status})`);
      } else if ((err as any)?.isAxiosError) {
        toast.error(`Network error: ${(err as any).message}`);
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6" style={{ padding: 32 }}>
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          Manage your profile information
        </p>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Avatar</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="text-lg">
              {(name || "")
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("") || "CN"}
            </AvatarFallback>
          </Avatar>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
