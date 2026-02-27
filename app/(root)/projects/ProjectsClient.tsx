"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
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
  categories,
  headerTitle,
  headerDescription,
  contact = null,
}: ProjectsClientProps) {
  /* ── State ──────────────────────────────────────────────────────── */

  const firstCat = categories[0]?.title ?? projects[0]?.category?.title ?? "";
  const [activeCategory, setActiveCategory] = useState<string>(firstCat);

  const headerRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  /* ── Entrance Animation ─────────────────────────────────────────── */

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (headerRef.current) {
        gsap.set(headerRef.current, { autoAlpha: 0, y: -30 });
        tl.to(headerRef.current, { autoAlpha: 1, y: 0, duration: 0.7 });
      }

      if (tabsRef.current) {
        const tabs = tabsRef.current.querySelectorAll("button");
        gsap.set(tabs, { autoAlpha: 0, scale: 0.92 });
        tl.to(tabs, { autoAlpha: 1, scale: 1, stagger: 0.06, duration: 0.5 }, "-=0.3");
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

      if (descRef.current) {
        gsap.set(descRef.current, { autoAlpha: 0, y: 20 });
        tl.to(descRef.current, { autoAlpha: 1, y: 0, duration: 0.5 }, "-=0.3");
      }
    });

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Re-animate cards on category change ────────────────────────── */

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
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        stagger: { amount: 0.4, from: "start" },
        duration: 0.5,
        ease: "power3.out",
      },
    );

    if (descRef.current) {
      gsap.fromTo(
        descRef.current,
        { autoAlpha: 0, y: 15 },
        { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out", delay: 0.15 },
      );
    }
  }, [activeCategory]);

  /* ── Derived state ──────────────────────────────────────────────── */

  const categoryTitles = useMemo(
    () =>
      categories.length
        ? categories.map((c) => c.title)
        : Array.from(new Set(projects.map((p) => p.category?.title ?? ""))),
    [categories, projects],
  );

  const filteredProjects = useMemo(
    () => projects.filter((p) => (p.category?.title ?? "") === activeCategory),
    [activeCategory, projects],
  );

  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = {};
    categoryTitles.forEach((c) => {
      map[c] = projects.filter((p) => (p.category?.title ?? "") === c).length;
    });
    return map;
  }, [categoryTitles, projects]);

  /* ── Keyboard nav for tabs ──────────────────────────────────────── */

  const handleCategoryKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
      let nextIdx = idx;
      if (e.key === "ArrowRight") nextIdx = (idx + 1) % categoryTitles.length;
      else if (e.key === "ArrowLeft")
        nextIdx = (idx - 1 + categoryTitles.length) % categoryTitles.length;
      else if (e.key === "Home") nextIdx = 0;
      else if (e.key === "End") nextIdx = categoryTitles.length - 1;
      else return;

      e.preventDefault();
      setActiveCategory(categoryTitles[nextIdx]);
      (
        document.querySelector(`[data-cat-index="${nextIdx}"]`) as HTMLButtonElement
      )?.focus();
    },
    [categoryTitles],
  );

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

        {/* ── Category Tabs ─────────────────────────────────────── */}
        <nav
          role="tablist"
          aria-label="Project categories"
          className="mb-10 md:mb-14"
        >
          <div ref={tabsRef} className="flex flex-wrap justify-center gap-2.5 sm:gap-3">
            {categoryTitles.map((category, idx) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  role="tab"
                  data-cat-index={idx}
                  aria-selected={isActive}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveCategory(category)}
                  onKeyDown={(e) => handleCategoryKeyDown(e, idx)}
                  className={`inline-flex items-center whitespace-nowrap gap-2 rounded-full px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#F68620]/40 ${
                    isActive
                      ? "bg-[#F68620] text-white shadow-[0_4px_14px_rgba(246,134,32,0.3)]"
                      : "bg-white text-gray-600 hover:text-[#F68620] hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  {category}
                  <span
                    className={`inline-flex items-center justify-center rounded-full min-w-[22px] h-[22px] px-1.5 text-xs font-semibold ${
                      isActive
                        ? "bg-white/25 text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {categoryCounts[category] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* ── Grid ──────────────────────────────────────────────── */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8"
        >
          {filteredProjects.length === 0 ? (
            <div className="col-span-full text-center py-20 text-gray-500">
              <p className="text-lg">
                No projects found for{" "}
                <strong className="text-[#F68620]">{activeCategory}</strong>.
              </p>
            </div>
          ) : (
            filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))
          )}
        </div>

        {/* ── Category Description ──────────────────────────────── */}
        <div
          ref={descRef}
          className="mt-12 md:mt-16 text-start max-w-3xl mx-auto"
          aria-live="polite"
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-3 text-[#191919]">
            {activeCategory}
          </h2>
          <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
            {categories.find((c) => c.title === activeCategory)?.description ?? ""}
          </p>
        </div>
      </div>

      {/* ── Contact Form ──────────────────────────────────────── */}
      <div className="mt-24 sm:mt-32 md:mt-40">
        <ContactForm contact={contact} />
      </div>
    </section>
  );
}
