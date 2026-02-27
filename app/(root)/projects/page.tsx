"use client";

import ContactForm from "@/app/components/contact/ContactForm";
import ProjectCard from "@/app/components/ProjectSections/ProjectCard";
import { useState, useMemo } from "react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";



if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

import { getProjectsList, getCategories, getProjectsSection } from "@/app/lib/api/home";
import type { ProjectItem, CategoryItem } from "@/app/lib/types/cms/home";
import { Skeleton } from "@/app/dashboard/components/ui/skeleton";

// categories and descriptions will come from API; start empty and populate on mount
// categories: list of category titles

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [categoriesList, setCategoriesList] = useState<CategoryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");


  const headerRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  const [headerTitle, setHeaderTitle] = useState<string>("");
  const [headerDescription, setHeaderDescription] = useState<string>("");

  // Entrance animation (once on mount)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (headerRef.current) {
        gsap.set(headerRef.current, { autoAlpha: 0, y: -30 });
        tl.to(headerRef.current, { autoAlpha: 1, y: 0, duration: 0.7 });
      }

      if (tabsRef.current) {
        const tabs = tabsRef.current.querySelectorAll("button");
        gsap.set(tabs, { autoAlpha: 0, y: 20 });
        tl.to(tabs, { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.5 }, "-=0.3");
      }

      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll(".project-card");
        gsap.set(cards, { autoAlpha: 0, y: 40 });
        tl.to(cards, { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.6 }, "-=0.2");
      }
    });

    return () => ctx.revert();
  }, []);

  // Re-animate cards on category change (skip first render)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const container = gridRef.current;
    if (!container) return;

    const cards = container.querySelectorAll(".project-card");
    if (!cards.length) return;

    gsap.killTweensOf(cards);
    gsap.fromTo(
      cards,
      { autoAlpha: 0, y: 30, scale: 0.96 },
      { autoAlpha: 1, y: 0, scale: 1, stagger: 0.08, duration: 0.45, ease: "power3.out" }
    );

    // Animate description
    if (descRef.current) {
      gsap.fromTo(
        descRef.current,
        { autoAlpha: 0, y: 15 },
        { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out", delay: 0.15 }
      );
    }
  }, [activeCategory]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([getProjectsList(), getCategories(), getProjectsSection()])
      .then(([projList, cats, sectionPayload]) => {
        if (!mounted) return;
        setProjects(projList);
        setCategoriesList(cats);
        // default active category to first category title if available
        const first = cats[0]?.title ?? projList[0]?.category?.title ?? "";
        setActiveCategory(first);

        if (sectionPayload && sectionPayload.projects_section && sectionPayload.projects_section.projects_section) {
          setHeaderTitle(sectionPayload.projects_section.projects_section.title ?? headerTitle);
          setHeaderDescription(sectionPayload.projects_section.projects_section.description ?? headerDescription);
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

  const filteredProjects = useMemo(
    () => projects.filter((project) => (project.category?.title ?? "") === activeCategory),
    [activeCategory, projects]
  );

  const categoryCounts = useMemo(() => {
    const map = {} as Record<string, number>;
    const titles = categoriesList.length ? categoriesList.map((c) => c.title) : Array.from(new Set(projects.map((p) => p.category?.title ?? "")));
    titles.forEach((c) => {
      map[c] = projects.filter((p) => (p.category?.title ?? "") === c).length;
    });
    return map;
  }, [categoriesList, projects]);

  const handleCategoryKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    idx: number
  ) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      const dir = e.key === "ArrowRight" ? 1 : -1;
      const titles = categoriesList.length ? categoriesList.map((c) => c.title) : Array.from(new Set(projects.map((p) => p.category?.title ?? "")));
      if (!titles.length) return;
      const next = (idx + dir + titles.length) % titles.length;
      setActiveCategory(titles[next]);
      const el = document.querySelector(`[data-index="${next}"]`) as HTMLButtonElement | null;
      el?.focus();
      e.preventDefault();
    } else if (e.key === "Home") {
      const titles = categoriesList.length ? categoriesList.map((c) => c.title) : Array.from(new Set(projects.map((p) => p.category?.title ?? "")));
      if (!titles.length) return;
      setActiveCategory(titles[0]);
      (document.querySelector(`[data-index="0"]`) as HTMLButtonElement)?.focus();
      e.preventDefault();
    } else if (e.key === "End") {
      const titles = categoriesList.length ? categoriesList.map((c) => c.title) : Array.from(new Set(projects.map((p) => p.category?.title ?? "")));
      if (!titles.length) return;
      const last = titles.length - 1;
      setActiveCategory(titles[last]);
      (document.querySelector(`[data-index="${last}"]`) as HTMLButtonElement)?.focus();
      e.preventDefault();
    }
  };

  return (
    
    <section className="bg-[#F8F8F8] pt-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div ref={headerRef}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-[#191919] mb-8">
            {headerTitle}
          </h1>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-8">{headerDescription}</p>
        </div>

        {/* Category Tabs (accessible + scrollable on small screens) */}
        <nav
          role="tablist"
          aria-label="Project categories"
          className="mb-8 flex justify-center flex-wrap"
        >
          <div ref={tabsRef} className="-mx-4 sm:mx-0 overflow-x-auto">
            <div className="inline-flex flex-wrap justify-center gap-3 px-4 sm:px-0">
              {(categoriesList.length ? categoriesList.map((c) => c.title) : Array.from(new Set(projects.map((p) => p.category?.title ?? ""))))
                .map((category) => category)
                .map((category, idx) => {
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
                      {categoryCounts[category] ?? 0}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Grid */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6 md:gap-8 items-stretch">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-full flex justify-center">
                <div className="project-card w-full max-w-sm bg-white rounded-lg shadow p-4">
                  <Skeleton className="h-40 w-full mb-4 rounded-lg" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))
          ) : filteredProjects.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              No projects found for <strong>{activeCategory}</strong>.
            </div>
          ) : (
            filteredProjects.map((project) => (
              <div key={project.id} className="w-full flex justify-center">
                <ProjectCard project={project} />
              </div>
            ))
          )}
        </div>

        {/* Category Description */}
        <div ref={descRef} className="mt-13 text-start max-w-3xl mx-auto" aria-live="polite">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 text-[#191919]">
            {activeCategory}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {categoriesList.find((c) => c.title === activeCategory)?.description ?? ""}
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
