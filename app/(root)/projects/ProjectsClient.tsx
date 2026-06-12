"use client";

import { useEffect, useRef } from "react";
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
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef  = useRef<HTMLDivElement>(null);
  const gridRef    = useRef<HTMLDivElement>(null);

  /* ── ScrollTrigger animations (matches ProjectsSection.tsx style) ── */

  useEffect(() => {
    const ctx = gsap.context(() => {

      /* Header: slide up + fade */
      if (headerRef.current) {
        gsap.set(headerRef.current, { autoAlpha: 0, y: 40 });
        ScrollTrigger.create({
          trigger: headerRef.current,
          start: "top 90%",
          once: true,
          onEnter: () => {
            gsap.to(headerRef.current!, {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
            });
          },
        });
      }

      /* Cards: staggered scale + slide + fade */
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll(".project-card");
        if (cards.length) {
          gsap.set(cards, { autoAlpha: 0, y: 60, scale: 0.92 });
          ScrollTrigger.create({
            trigger: gridRef.current,
            start: "top 85%",
            once: true,
            onEnter: () => {
              gsap.to(cards, {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                stagger: { amount: 0.6, from: "start" },
                duration: 0.7,
                ease: "back.out(1.4)",
              });
            },
          });
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [projects]);

  /* ── Render ─────────────────────────────────────────────────────── */

  return (
    <section ref={sectionRef} className="bg-[#F8F8F8] min-h-screen pt-32 sm:pt-36 md:pt-40">
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
          className="flex flex-wrap justify-center gap-4 sm:gap-5 md:gap-6"
        >
          {projects.map((project) => (
            <div key={project.id} className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-16px)]">
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
