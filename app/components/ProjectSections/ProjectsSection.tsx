"use client";

import React, { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectCard from "./ProjectCard";
import type { ProjectItem } from "@/app/lib/types/cms/home";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ProjectsSectionProps {
  projects?: ProjectItem[];
  title?: string;
  description?: string;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects = [],
  title = "Our Projects",
  description = "Discover our latest commercial design solutions across pizza stores, retail shops, cafes, and restaurants.",
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  /* ── Derive featured projects (first per category) ─────────────── */

  const featuredProjects = useMemo(() => {
    const seen = new Set<number | string>();
    const featured: ProjectItem[] = [];
    for (const p of projects) {
      const key = p.category?.title ?? p.category_id;
      if (!seen.has(key)) {
        seen.add(key);
        featured.push(p);
      }
    }
    return featured;
  }, [projects]);

  /* ── Scroll-triggered entrance ──────────────────────────────────── */

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
  }, [featuredProjects]);

  /* ── Render ─────────────────────────────────────────────────────── */

  return (
    <section ref={sectionRef} id="projects" className="bg-[#EEEEEE] py-20">
      <div className="max-w-[1440px] mx-auto px-6 md:px-20">

        {/* Header */}
        <div ref={headerRef} className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#1E1E1E] mb-4">{title}</h2>
          <p className="text-[#1E1E1E] max-w-3xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
