"use client";

import "./dashboard.css";
import { AppSidebar } from "./components/app-sidebar";
import { SiteHeader } from "./components/site-header";
import { SidebarProvider } from "./components/ui/sidebar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false); // State to track client-side rendering

  // Only run the router logic on the client-side
  useEffect(() => {
    // Set `isClient` to true when component mounts on the client
    setIsClient(true);

    // Check if token exists in localStorage or cookies
    const token =
      localStorage.getItem("auth_token") ||
      document.cookie
        .split(";")
        .map((p) => p.trim())
        .find((p) => p.startsWith("auth_token="))
        ?.split("=")[1];

    if (!token) {
      // Redirect to login if no token
      router.replace("/login");
    }
  }, [router]);

  // Prevent rendering until it's confirmed that we're on the client side
  if (!isClient) {
    return null; // Return nothing during SSR
  }

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "16rem",
        "--header-height": "3rem",
      } as React.CSSProperties}
    >
      <AppSidebar />
      <main style={{ fontFamily: "var(--font-display)" }} className="relative flex min-h-svh flex-1 flex-col bg-background">
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">{children}</div>
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}