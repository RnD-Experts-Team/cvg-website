"use client";
import * as React from "react";
import {
  ArrowUpCircleIcon,
  LayoutDashboardIcon,
  FileIcon,
  SettingsIcon,
  HelpCircleIcon,
  Footprints,
  InspectionPanelIcon,
  CaptionsIcon,
  FolderKanbanIcon,
  ChartCandlestickIcon,
  ToolboxIcon,
  CpuIcon,
  Info,
  UserCircleIcon,
} from "lucide-react";
import { NavMain } from "@/app/dashboard/components/nav-main";
import { NavSecondary } from "@/app/dashboard/components/nav-secondary";
import { NavUser } from "@/app/dashboard/components/nav-user";
import { getStoredUser } from "@/app/lib/http/auth"; // Import the function to get user data from localStorage
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/app/dashboard/components/ui/sidebar";

const data = {
  user: {
    email: "",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Site Metadata",
      url: "/dashboard/site-metadata",
      icon: InspectionPanelIcon,
    },
    {
      title: "Footer",
      url: "/dashboard/footer",
      icon: Footprints,
    },
    {
      title: "Hero",
      url: "/dashboard/hero",
      icon: CaptionsIcon,
    },
    {
      title: "Projects",
      url: "/dashboard/projects",
      icon: FolderKanbanIcon,
    },
    {
      title: "Services",
      url: "/dashboard/services",
      icon: ToolboxIcon,
    },
    {
      title: "Values",
      url: "/dashboard/values",
      icon: ChartCandlestickIcon,
    },
    {
      title: "Process",
      url: "/dashboard/process",
      icon: CpuIcon,
    },
    {
      title: "About",
      url: "/dashboard/about",
      icon: Info,
    },
    {
      title: "Contact",
      url: "/dashboard/contact",
      icon: UserCircleIcon,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/setting",
      icon: SettingsIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [storedUser] = React.useState(() => {
    return getStoredUser() ?? data.user;
  });

  return (
    <Sidebar collapsible="offcanvas" variant="sidebar" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="http://localhost:3000/" className=" flex items-center gap-5">
                <img src="img/logo.png" className=" object-cover object-contain w-[25px] h-[25px]" />
                <span className="text-base font-semibold">CVG-CMS</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser  />
      </SidebarFooter>
    </Sidebar>
  );
}