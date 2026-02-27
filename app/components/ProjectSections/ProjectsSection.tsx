"use client";

import React, { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";
import { useScrollAnimation } from "@/app/lib/useScrollAnimation";
import { getProjectsList } from "@/app/lib/api/home";
import { getProjectsSection } from "@/app/lib/api/home";
import type { ProjectItem } from "@/app/lib/types/cms/home";

const ProjectsSection: React.FC = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sectionTitle, setSectionTitle] = useState<string>("Our Projects");
  const [sectionDescription, setSectionDescription] = useState<string>("Discover our latest commercial design solutions across pizza stores, retail shops, cafes, and restaurants.");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([getProjectsList(), getProjectsSection()])
      .then(([list, sectionPayload]) => {
        if (!mounted) return;
        setProjects(list);
        // pick first project per category.title (if available) or category_id
        const seen = new Set<number | string>();
        const featured: ProjectItem[] = [];
        for (const p of list) {
          const key = p.category?.title ?? p.category_id;
          if (!seen.has(key)) {
            seen.add(key);
            featured.push(p);
          }
        }
        setFeaturedProjects(featured);

        if (sectionPayload && sectionPayload.projects_section && sectionPayload.projects_section.projects_section) {
          setSectionTitle(sectionPayload.projects_section.projects_section.title ?? sectionTitle);
          setSectionDescription(sectionPayload.projects_section.projects_section.description ?? sectionDescription);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const gridRef = useScrollAnimation<HTMLDivElement>({
    childSelector: ".project-card",
    from: { autoAlpha: 0, y: 50 },
    stagger: 0.12,
    duration: 0.8,
    start: "top 85%",
  });

  const headerRef = useScrollAnimation<HTMLDivElement>({
    from: { autoAlpha: 0, y: 30 },
    duration: 0.7,
    animateContainer: true,
    start: "top 90%",
  });

  return (
    <section id="projects" className="bg-[#EEEEEE] py-20">
      <div className="max-w-[1440px] mx-auto px-6 md:px-20">
        <div ref={headerRef} className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#1E1E1E] mb-4">{sectionTitle}</h2>
          <p className="text-[#1E1E1E] max-w-3xl mx-auto leading-relaxed">{sectionDescription}</p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-full max-w-sm project-card">
                  <div className="animate-pulse">
                    <div className="h-48 bg-gray-300 rounded-lg mb-4" />
                    <div className="h-4 bg-gray-300 rounded w-5/6 mb-2" />
                    <div className="h-4 bg-gray-300 rounded w-3/4" />
                  </div>
                </div>
              ))
            : featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} className="project-card" />
              ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
