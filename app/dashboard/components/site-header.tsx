import Link from "next/link";
import { usePathname } from "next/navigation";
import { Separator } from "@/app/dashboard/components/ui/separator";
import { SidebarTrigger } from "@/app/dashboard/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/dashboard/components/ui/breadcrumb";

function formatSegment(seg: string) {
  return seg
    .replace(/[-_]/g, " ")
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

const TITLE_MAP: Record<string, string> = {
  dashboard: "Dashboard",
  projects: "Projects",
  services: "Services",
  settings: "Settings",
  about: "About",
};

export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const segments = pathname.split("/").filter(Boolean);

  const crumbs: { href: string; label: string }[] = [];
  let acc = "";
  segments.forEach((seg) => {
    acc += `/${seg}`;
    crumbs.push({ href: acc, label: TITLE_MAP[seg] ?? formatSegment(seg) });
  });

  // ensure at least Dashboard root appears when inside dashboard
  if (crumbs.length === 0 || crumbs[0].href !== "/dashboard") {
    // if current path includes dashboard, make dashboard root first
    if (pathname.startsWith("/dashboard")) {
      crumbs.unshift({ href: "/dashboard", label: "Dashboard" });
    }
  }

  return (
    <header className="sticky top-0 z-10 flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />

        <div className="flex-1">
          <Breadcrumb>
            <BreadcrumbList>
              {crumbs.length === 0 ? (
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              ) : (
                crumbs.flatMap((c, i) => {
                  const isLast = i === crumbs.length - 1;
                  return [
                    <BreadcrumbItem key={`item-${c.href}`}>
                      {isLast ? (
                        <BreadcrumbPage>{c.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link href={c.href}>{c.label}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>,
                    !isLast ? <BreadcrumbSeparator key={`sep-${c.href}`} /> : null,
                  ];
                })
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
    </header>
  );
}
