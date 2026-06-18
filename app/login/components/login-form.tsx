"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { HiEye, HiEyeOff } from "react-icons/hi";

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
  const [showPassword, setShowPassword] = React.useState(false);

  const client = new HttpClient({
    baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "",
    getToken: () => null,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
        data: { token: string; user: { email?: string } };
        message?: string;
      }>({ email, password });

      const token = response.data?.token;
      const user = response.data?.user;

      if (!token || !user) throw new Error("Invalid login response");

      login(token, user);
      document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 8}; samesite=lax`;
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
          const serverMsg = err.message || "An unexpected error occurred.";
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
    <div className={cn("w-full max-w-[420px]", className)} {...props}>
      {/* Card */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl px-8 py-10 border border-white/20">
        {/* Orange accent bar */}
        <div className="w-10 h-[3px] bg-[#F68620] rounded-full mb-7" />

        {/* Heading */}
        <h1 className="text-[22px] font-bold text-[#1E1E1E] leading-tight mb-1">
          Welcome back
        </h1>
        <p className="text-sm text-gray-400 mb-8">
          Sign in to your CVG Dashboard
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#1E1E1E]"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-[10px] border border-gray-200 bg-[#F8F8F8] text-[#1E1E1E] text-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F68620]/25 focus:border-[#F68620] transition-colors"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#1E1E1E]"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-11 rounded-[10px] border border-gray-200 bg-[#F8F8F8] text-[#1E1E1E] text-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F68620]/25 focus:border-[#F68620] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#F68620] transition-colors p-0.5 rounded"
              >
                {showPassword ? <HiEyeOff size={18} /> : <HiEye size={18} />}
              </button>
            </div>
          </div>

          {/* Inline error */}
          {error && (
            <p className="text-red-500 text-sm leading-snug">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 mt-1 rounded-[10px] bg-[#F68620] text-white text-sm font-semibold tracking-wide hover:bg-[#e07818] active:scale-[0.98] transition-all duration-200 disabled:opacity-55 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
