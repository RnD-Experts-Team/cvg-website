"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { HomePageData } from "@/app/lib/types/cms/home";

const HeroSection = dynamic(() => import("./HeroSection"), {
  ssr: false,
  loading: () => (
    <section className="relative w-full h-[100vh] bg-black" />
  ),
});

interface Props {
  heroData: HomePageData["data"]["hero"];  // Adjusted type to match CMS data structure
}

export default function HeroClient({ heroData }: Props) {
  // Force scroll to top on page load/refresh
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  return <HeroSection heroData={heroData} />;
}
