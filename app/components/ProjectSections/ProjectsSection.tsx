"use client";

import React from "react";
import ProjectCard from "./ProjectCard";
import { projects } from "./ProjectData";
import { useScrollAnimation } from "@/app/lib/useScrollAnimation";

const ProjectsSection: React.FC = () => {
  const featuredProjects = React.useMemo(() => {
    const categories = ["Pizza Stores", "Retail Shops", "Cafes", "Restaurants"] as const;

    return categories
      .map((cat) => projects.find((p) => p.category === cat))
      .filter((p): p is (typeof projects)[number] => Boolean(p));
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
          <h2 className="text-4xl font-bold text-[#1E1E1E] mb-4">Our Projects</h2>
          <p className="text-[#1E1E1E] max-w-3xl mx-auto leading-relaxed">
            Discover our latest commercial design solutions across pizza stores, retail
            shops, cafes, and restaurants.
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
          {featuredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              image={project.image}
              title={project.title}
              description={project.description}
              link={`/projects/${project.id}`}
              className="project-card"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
