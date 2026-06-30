"use client";

import React, { useEffect, useRef, useState } from "react";
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

const GAP = 24;

const ChevronLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
    className="w-5 h-5">
    <path d="M15 19l-7-7 7-7" />
  </svg>
);
const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
    className="w-5 h-5">
    <path d="M9 5l7 7-7 7" />
  </svg>
);

/* Cards visible at a time based on viewport width */
function getVisible(vw: number, total: number): number {
  if (vw >= 1280) return Math.min(total, 5);
  if (vw >= 1024) return Math.min(total, 3);
  if (vw >= 640)  return Math.min(total, 2);
  return 1;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects = [],
  title = "Our Projects",
  description = "Discover our latest commercial design solutions across pizza stores, retail shops, cafes, and restaurants.",
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef  = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);
  const tweenRef   = useRef<gsap.core.Tween | null>(null);
  const touchX     = useRef(0);

  const [index,   setIndex]   = useState(0);
  const [visible, setVisible] = useState(3);

  const count   = projects.length;
  const maxIdx  = Math.max(0, count - visible);
  const showAll = visible >= count; // all cards fit → no slider needed

  /* ── Responsive visible count ─────────────────────────────────────── */
  useEffect(() => {
    const update = () => {
      const v = getVisible(window.innerWidth, count);
      setVisible(v);
      setIndex(i => Math.min(i, Math.max(0, count - v)));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [count]);

  /* ── Animate track on index / visible change ──────────────────────── */
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const track   = trackRef.current;
    if (!track) return;

    if (showAll || !wrapper) {
      gsap.set(track, { x: 0 });
      return;
    }

    const cw = (wrapper.offsetWidth - GAP * (visible - 1)) / visible;
    const x  = -(index * (cw + GAP));
    tweenRef.current?.kill();
    tweenRef.current = gsap.to(track, { x, duration: 0.5, ease: "power2.inOut" });
  }, [index, visible, showAll]);

  /* ── Re-snap position on resize without animation ─────────────────── */
  useEffect(() => {
    const onResize = () => {
      const wrapper = wrapperRef.current;
      const track   = trackRef.current;
      if (!wrapper || !track || showAll) return;
      const cw = (wrapper.offsetWidth - GAP * (visible - 1)) / visible;
      gsap.set(track, { x: -(index * (cw + GAP)) });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [index, visible, showAll]);

  /* ── Scroll-triggered entrance animations ─────────────────────────── */
  useEffect(() => {
    if (!count) return;
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.set(headerRef.current, { autoAlpha: 0, y: 40 });
        ScrollTrigger.create({
          trigger: headerRef.current,
          start: "top 90%",
          once: true,
          onEnter: () =>
            gsap.to(headerRef.current!, {
              autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out",
            }),
        });
      }
      if (wrapperRef.current) {
        gsap.set(wrapperRef.current, { autoAlpha: 0 });
        ScrollTrigger.create({
          trigger: wrapperRef.current,
          start: "top 95%",
          once: true,
          onEnter: () =>
            gsap.to(wrapperRef.current!, { autoAlpha: 1, duration: 0.5 }),
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, [count]);

  if (!count) return null;

  const prev = () => setIndex(i => Math.max(0, i - 1));
  const next = () => setIndex(i => Math.min(maxIdx, i + 1));

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = touchX.current - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 50) dx > 0 ? next() : prev();
  };

  const arrowCls = [
    "absolute top-1/2 -translate-y-1/2 z-20",
    "flex items-center justify-center w-11 h-11 rounded-full",
    "bg-white dark:bg-white/10",
    "border border-[#E0E0E0] dark:border-white/15",
    "shadow-md",
    "hover:bg-[#F68620] hover:border-[#F68620] hover:shadow-xl hover:scale-105",
    "dark:hover:bg-[#F68620] dark:hover:border-[#F68620]",
    "group transition-all duration-200 backdrop-blur-sm select-none",
    "disabled:opacity-30 disabled:cursor-not-allowed",
    "disabled:hover:bg-white disabled:hover:border-[#E0E0E0]",
    "disabled:hover:shadow-md disabled:hover:scale-100",
    "dark:disabled:hover:bg-white/10 dark:disabled:hover:border-white/15",
  ].join(" ");

  const iconCls =
    "text-[#1E1E1E] dark:text-white group-hover:text-white transition-colors duration-200";

  const cardStyle: React.CSSProperties = showAll
    ? { flex: "1 1 0", minWidth: 0, maxWidth: "300px" }
    : {
        flex: `0 0 calc((100% - ${GAP * (visible - 1)}px) / ${visible})`,
        minWidth: 0,
      };

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="bg-[#EEEEEE] dark:bg-[#111111] py-20"
    >
      {/* Header */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-20">
        <div ref={headerRef} className="text-center mb-14">
          <span className="inline-block text-[#F68620] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Portfolio
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1E1E1E] dark:text-white mb-4 leading-tight">
            {title}
          </h2>
          <div className="w-12 h-1 bg-[#F68620] rounded-full mx-auto mb-5" />
          <p className="text-[#555555] dark:text-white/55 max-w-2xl mx-auto leading-relaxed text-base">
            {description}
          </p>
        </div>
      </div>

      {/* Slider */}
      <div className="relative max-w-[1440px] mx-auto px-14 md:px-24">
        {!showAll && (
          <button
            onClick={prev}
            disabled={index === 0}
            aria-label="Previous projects"
            className={`${arrowCls} left-2 md:left-4`}
          >
            <span className={iconCls}><ChevronLeft /></span>
          </button>
        )}

        <div
          ref={wrapperRef}
          className="overflow-hidden py-6"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          style={!showAll ? {
            maskImage:
              "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
          } : undefined}
        >
          <div
            ref={trackRef}
            className={`flex will-change-transform ${showAll ? "justify-center" : ""}`}
            style={{ gap: `${GAP}px` }}
          >
            {projects.map(project => (
              <div key={project.id} style={cardStyle}>
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        </div>

        {!showAll && (
          <button
            onClick={next}
            disabled={index >= maxIdx}
            aria-label="Next projects"
            className={`${arrowCls} right-2 md:right-4`}
          >
            <span className={iconCls}><ChevronRight /></span>
          </button>
        )}
      </div>

      {/* Pagination dots */}
      {!showAll && maxIdx > 0 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: maxIdx + 1 }, (_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-200 ${
                i === index
                  ? "w-6 bg-[#F68620]"
                  : "w-2 bg-gray-400/50 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProjectsSection;
