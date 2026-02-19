"use client";

import ContactForm from "@/app/components/contact/ContactForm";
import ProjectCard from "@/app/components/ProjectSections/ProjectCard";
import { projects } from "@/app/components/ProjectSections/ProjectData";
import { ProjectCategory } from "@/types/projects";
import { useState, useMemo } from "react";

const categories: ProjectCategory[] = [
  "Pizza Stores",
  "Retail Shops",
  "Cafes",
  "Restaurants",
];

const categoryDescriptions: Record<ProjectCategory, string> = {
  "Pizza Stores":
    "Modern and vibrant pizza store concepts designed for high customer engagement.",
  "Retail Shops":
    "Smart retail environments optimized for branding and conversion.",
  Cafes:
    "Warm and welcoming café spaces that enhance customer comfort.",
  Restaurants:
    "Premium restaurant designs combining atmosphere and functionality.",
};

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] =
    useState<ProjectCategory>("Pizza Stores");

  const filteredProjects = useMemo(
    () => projects.filter((project) => project.category === activeCategory),
    [activeCategory]
  );

  const categoryCounts = useMemo(() => {
    const map = {} as Record<ProjectCategory, number>;
    categories.forEach((c) => {
      map[c] = projects.filter((p) => p.category === c).length;
    });
    return map;
  }, []);

  const handleCategoryKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    idx: number
  ) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      const dir = e.key === "ArrowRight" ? 1 : -1;
      const next = (idx + dir + categories.length) % categories.length;
      setActiveCategory(categories[next]);
      const el = document.querySelector(`[data-index=\"${next}\"]`) as
        | HTMLButtonElement
        | null;
      el?.focus();
      e.preventDefault();
    } else if (e.key === "Home") {
      setActiveCategory(categories[0]);
      (document.querySelector(`[data-index=\"0\"]`) as HTMLButtonElement)?.focus();
      e.preventDefault();
    } else if (e.key === "End") {
      const last = categories.length - 1;
      setActiveCategory(categories[last]);
      (document.querySelector(`[data-index=\"${last}\"]`) as HTMLButtonElement)?.focus();
      e.preventDefault();
    }
  };

  return (
    
    <section className="bg-[#F8F8F8] pt-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-[#191919] mb-8">
          Our Projects
        </h1>

        {/* Category Tabs (accessible + scrollable on small screens) */}
        <nav
          role="tablist"
          aria-label="Project categories"
          className="mb-8 flex justify-center flex-wrap"
        >
          <div className="-mx-4 sm:mx-0 overflow-x-auto">
            <div className="inline-flex flex-wrap justify-center gap-3 px-4 sm:px-0">
              {categories.map((category, idx) => {
                const isActive = activeCategory === category;
                return (
                  <button
                    key={category}
                    role="tab"
                    data-index={idx}
                    aria-selected={isActive}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => setActiveCategory(category)}
                    onKeyDown={(e) => handleCategoryKeyDown(e, idx)}
                    className={`inline-flex items-center whitespace-nowrap gap-2 rounded-full px-4 py-2 text-sm sm:text-base font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#F68620]/40 
                      ${
                        isActive
                          ? "bg-[#F68620]/10 text-[#F68620] ring-1 ring-[#F68620]/20"
                          : "text-gray-600 hover:text-[#F68620] hover:bg-gray-50"
                      }`}
                  >
                    {category}
                    <span className="ml-2 inline-flex items-center justify-center rounded-full bg-white/20 px-2 py-0.5 text-xs text-gray-600">
                      {categoryCounts[category]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6 md:gap-8 items-stretch">
          {filteredProjects.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              No projects found for <strong>{activeCategory}</strong>.
            </div>
          ) : (
            filteredProjects.map((project) => (
              <div key={project.id} className="w-full flex justify-center">
                <ProjectCard {...project} />
              </div>
            ))
          )}
        </div>

        {/* Category Description */}
        <div className="mt-13 text-start max-w-3xl mx-auto" aria-live="polite">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 text-[#191919]">
            {activeCategory}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {categoryDescriptions[activeCategory]}
          </p>
        </div>
      </div>

         {/* Contact Form */}
         <div className=" mt-[200px]">
            <ContactForm />
         </div>
    </section>
    
  );
}
