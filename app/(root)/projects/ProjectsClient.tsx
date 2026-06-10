"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectCard from "@/app/components/ProjectSections/ProjectCard";
import ContactForm from "@/app/components/contact/ContactForm";
import type { ProjectItem, CategoryItem, HomePageData } from "@/app/lib/types/cms/home";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ProjectsClientProps {
  projects: ProjectItem[];
  categories: CategoryItem[];
  headerTitle: string;
  headerDescription: string;
  contact?: HomePageData["data"]["contact_section"] | null;
}

export default function ProjectsClient({
  projects,
  headerTitle,
  headerDescription,
  contact = null,
}: ProjectsClientProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  /* ── Entrance Animation ─────────────────────────────────────────── */

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (headerRef.current) {
        gsap.set(headerRef.current, { autoAlpha: 0, y: -30 });
        tl.to(headerRef.current, { autoAlpha: 1, y: 0, duration: 0.7 });
      }

      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll(".project-card");
        gsap.set(cards, { autoAlpha: 0, y: 50, scale: 0.96 });
        tl.to(
          cards,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            stagger: { amount: 0.5, from: "start" },
            duration: 0.6,
          },
          "-=0.2",
        );
      }
    });

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Render ─────────────────────────────────────────────────────── */

  return (
    <section className="bg-[#F8F8F8] min-h-screen pt-32 sm:pt-36 md:pt-40 ">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Header ────────────────────────────────────────────── */}
        <div ref={headerRef} className="mb-10 md:mb-14 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#191919] mb-4 leading-tight">
            {headerTitle}
          </h1>
          {headerDescription && (
            <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
              {headerDescription}
            </p>
          )}
        </div>

        {/* ── Grid ──────────────────────────────────────────────── */}
        <div
          ref={gridRef}
          className="flex flex-wrap justify-center gap-5 sm:gap-6 md:gap-8"
        >
          {projects.map((project) => (
            <div
              key={project.id}
              className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-22px)]"
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Contact Form ──────────────────────────────────────── */}
      <div className="mt-24 sm:mt-32 md:mt-40">
        <ContactForm contact={contact} />
      </div>
    </section>
  );
}
