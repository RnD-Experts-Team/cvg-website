"use client";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
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
import Link from "next/link";
import { HttpError } from "@/app/lib/http/errors";
import { HttpClient } from "@/app/lib/http/http-client";
import { toast } from "react-toastify"; // Import toast for error/success notifications

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  // prefer an explicit NEXT_PUBLIC_API_URL, otherwise fall back to a relative path
  // so that the API call will go against the same origin (e.g. `/api/auth/login`)
  // which is convenient for local development and avoids CORS issues.
  const client = new HttpClient({
    baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "",
    getToken: () => localStorage.getItem("auth_token"), // Retrieve token from localStorage
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // basic validation before sending request
    if (email.trim() === "" || password.trim() === "") {
      const msg = "Email and password are required.";
      setError(msg);
      toast.error(msg);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const nextPath = searchParams.get("next") || "/dashboard"; // Redirect after login

    try {
      // API returns { success, data: { token, user }, message }
      const response = await client.login<{
        success: boolean;
        data: { token: string; user?: any };
        message?: string;
      }>({ email, password });

      const token = response.data?.token;
      if (!token) {
        throw new Error("Login response missing token");
      }

      // Save token to localStorage and set cookie for SSR/middleware
      localStorage.setItem("auth_token", token);
      document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 8}; samesite=lax`;

      // Show success toast
      toast.success(response.message || "Login successful!");

      // Redirect user to the desired page (dashboard or nextPath)
      router.replace(nextPath);
      router.refresh();
    } catch (error: unknown) {
      // Display diagnostic information to make debugging easier.  The
      // original implementation always showed a generic toast which made it
      // impossible to tell whether the request actually reached the server or
      // whether the error was e.g. a network/CORS failure.
      console.error("Login failed:", error);

      if (error instanceof HttpError) {
        const serverMsg = error.message || "An unknown error occurred. Please try again.";
        // if credentials are wrong, show specific message
        if (error.status === 400 || error.status === 401) {
          const msg = "Email or password is incorrect.";
          setError(msg);
          toast.error(msg);
        } else {
          setError(serverMsg);
          toast.error(`Login failed (${error.status}): ${serverMsg}`);
        }
      } else if ((error as any)?.isAxiosError) {
        // network / CORS / other axios-specific problems
        const ax = error as any;
        toast.error(`Network error: ${ax.message}`);
      } else {
        toast.error("Login failed! Please check your credentials.");
      }
    } finally {
      setIsSubmitting(false); // Stop the loading state
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login to your First Team Trucking account</CardDescription>
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
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Signing in..." : "Login"}
                </Button>
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="#" className="underline underline-offset-4">
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