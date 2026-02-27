"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";

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

import { cn } from "@/app/lib/utils/utils";
import { HttpClient } from "@/app/lib/http/http-client";
import { HttpError } from "@/app/lib/http/errors";
import { useAuthStore } from "@/app/dashboard/stores/auth.store";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const login = useAuthStore((state) => state.login);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const client = new HttpClient({
    baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "",
    getToken: () => null,
  });

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      const msg = "Email and password are required.";
      setError(msg);
      toast.error(msg);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const nextPath = searchParams.get("next") || "/dashboard";

    try {
      const response = await client.login<{
        success: boolean;
        data: {
          token: string;
          user: { email?: string };
        };
        message?: string;
      }>({ email, password });

      const token = response.data?.token;
      const user = response.data?.user;

      if (!token || !user) {
        throw new Error("Invalid login response");
      }

      // ✅ Store everything via Zustand
      login(token, user);

      // ✅ Set cookie for middleware / SSR
      document.cookie = `auth_token=${token}; path=/; max-age=${
        60 * 60 * 8
      }; samesite=lax`;

      toast.success(response.message || "Login successful!");

      router.replace(nextPath);
      router.refresh();
    } catch (err: unknown) {
      console.error("Login failed:", err);

      if (err instanceof HttpError) {
        if (err.status === 400 || err.status === 401) {
          const msg = "Email or password is incorrect.";
          setError(msg);
          toast.error(msg);
        } else {
          const serverMsg =
            err.message || "An unexpected error occurred.";
          setError(serverMsg);
          toast.error(`Login failed (${err.status}): ${serverMsg}`);
        }
      } else if ((err as any)?.isAxiosError) {
        toast.error(`Network error: ${(err as any).message}`);
      } else {
        toast.error("Login failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            Welcome back
          </CardTitle>
          <CardDescription>
            Login to your First Team Trucking account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Signing in..."
                    : "Login"}
                </Button>
              </div>

              {error && (
                <div className="text-red-500 text-sm">
                  {error}
                </div>
              )}

              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href="#"
                  className="underline underline-offset-4"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}