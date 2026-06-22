"use client";

import React, { useEffect, useRef, useCallback } from "react";
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

const CARD_WIDTH = 300;
const CARD_GAP   = 24;
const CARD_STEP  = CARD_WIDTH + CARD_GAP;
const COPIES     = 4;
const AUTO_SPEED = 100; // px / sec

/* ── Inline SVG chevrons ─────────────────────────────────────────────── */
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

/* ── Component ───────────────────────────────────────────────────────── */

const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects = [],
  title = "Our Projects",
  description = "Discover our latest commercial design solutions across pizza stores, retail shops, cafes, and restaurants.",
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef  = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);
  const goTweenRef = useRef<gsap.core.Tween | null>(null);

  /**
   * All mutable animation state in a ref — never stale inside callbacks.
   * arrowBusy: true while an arrow tween is running (ticker yields to it)
   */
  const stateRef = useRef({
    pos: 0,
    paused: false,
    arrowBusy: false,
  });

  /**
   * Touch tracking state. Kept separate so it doesn't mix with animation
   * state mutations that happen on every ticker frame.
   */
  const touchRef = useRef({
    startX: 0,
    startY: 0,
    lastX: 0,
    dir: "unknown" as "unknown" | "h" | "v",
  });

  const oneSetWidth = CARD_STEP * (projects.length || 1);

  /* 4 identical copies → loop never gaps */
  const loopCards = projects.length > 0
    ? Array.from({ length: COPIES }, () => projects).flat()
    : [];

  /* Wrap position to [0, oneSetWidth) */
  const normalize = useCallback(
    (pos: number) => ((pos % oneSetWidth) + oneSetWidth) % oneSetWidth,
    [oneSetWidth],
  );

  /* Smooth per-card arrow jump */
  const go = useCallback(
    (dir: 1 | -1) => {
      const s = stateRef.current;
      s.arrowBusy = true;
      const start = s.pos;
      const proxy = { p: 0 };

      goTweenRef.current?.kill();
      goTweenRef.current = gsap.to(proxy, {
        p: 1,
        duration: 0.45,
        ease: "power2.inOut",
        onUpdate: () => {
          s.pos = normalize(start + dir * CARD_STEP * proxy.p);
          if (trackRef.current) gsap.set(trackRef.current, { x: -s.pos });
        },
        onComplete: () => { s.arrowBusy = false; },
      });
    },
    [normalize],
  );

  useEffect(() => {
    if (!projects.length) return;

    const s     = stateRef.current;
    const touch = touchRef.current;
    const wrapper = wrapperRef.current;

    /* ── Ticker-based auto-play ──────────────────────────────────── */
    // GSAP passes deltaTime in ms → ÷1000 converts to px/sec scale
    const tick = (_time: number, dt: number) => {
      if (s.paused || s.arrowBusy) return;
      s.pos = normalize(s.pos + AUTO_SPEED * (dt / 1000));
      if (trackRef.current) gsap.set(trackRef.current, { x: -s.pos });
    };
    gsap.ticker.add(tick);

    /* ── Mouse-wheel ─────────────────────────────────────────────── */
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      s.pos = normalize(s.pos + e.deltaY * 0.7);
      if (trackRef.current) gsap.set(trackRef.current, { x: -s.pos });
    };
    wrapper?.addEventListener("wheel", onWheel, { passive: false });

    /* ── Touch: swipe to drag ────────────────────────────────────── */
    const onTouchStart = (e: TouchEvent) => {
      touch.startX = touch.lastX = e.touches[0].clientX;
      touch.startY = e.touches[0].clientY;
      touch.dir = "unknown";
      s.paused = true;
    };

    const onTouchMove = (e: TouchEvent) => {
      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;

      /* Determine swipe axis on first ≥3 px of movement */
      if (touch.dir === "unknown") {
        const dx = Math.abs(x - touch.startX);
        const dy = Math.abs(y - touch.startY);
        if (dx > 3 || dy > 3) touch.dir = dx >= dy ? "h" : "v";
      }

      if (touch.dir === "h") {
        e.preventDefault();                    // block page scroll
        const delta = touch.lastX - x;        // positive = drag left (forward)
        s.pos = normalize(s.pos + delta);
        if (trackRef.current) gsap.set(trackRef.current, { x: -s.pos });
      }

      touch.lastX = x;
    };

    const onTouchEnd = () => {
      touch.dir = "unknown";
      s.paused = false;                        // resume auto-play
    };

    wrapper?.addEventListener("touchstart",  onTouchStart, { passive: true });
    wrapper?.addEventListener("touchmove",   onTouchMove,  { passive: false });
    wrapper?.addEventListener("touchend",    onTouchEnd,   { passive: true });
    wrapper?.addEventListener("touchcancel", onTouchEnd,   { passive: true });

    /* ── Hover pause (desktop) ───────────────────────────────────── */
    const onEnter = () => { s.paused = true; };
    const onLeave = () => { s.paused = false; };
    wrapper?.addEventListener("mouseenter", onEnter);
    wrapper?.addEventListener("mouseleave", onLeave);

    /* ── Scroll-triggered entrance animations ────────────────────── */
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

    return () => {
      gsap.ticker.remove(tick);
      goTweenRef.current?.kill();
      ctx.revert();
      wrapper?.removeEventListener("wheel",       onWheel);
      wrapper?.removeEventListener("touchstart",  onTouchStart);
      wrapper?.removeEventListener("touchmove",   onTouchMove);
      wrapper?.removeEventListener("touchend",    onTouchEnd);
      wrapper?.removeEventListener("touchcancel", onTouchEnd);
      wrapper?.removeEventListener("mouseenter",  onEnter);
      wrapper?.removeEventListener("mouseleave",  onLeave);
    };
  }, [projects, normalize]);

  if (!loopCards.length) return null;

  /* ── Arrow button shared classes ─────────────────────────────────── */
  const arrowCls = [
    "absolute top-1/2 -translate-y-1/2 z-20",
    "flex items-center justify-center w-11 h-11 rounded-full",
    "bg-white dark:bg-white/10",
    "border border-[#E0E0E0] dark:border-white/15",
    "shadow-md",
    "hover:bg-[#F68620] hover:border-[#F68620] hover:shadow-xl hover:scale-105",
    "dark:hover:bg-[#F68620] dark:hover:border-[#F68620]",
    "group transition-all duration-200 backdrop-blur-sm",
    "select-none",
  ].join(" ");

  const iconCls =
    "text-[#1E1E1E] dark:text-white group-hover:text-white transition-colors duration-200";

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="bg-[#EEEEEE] dark:bg-[#111111] py-20 overflow-hidden"
    >
      {/* ── Header ────────────────────────────────────────────────── */}
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

      {/* ── Slider ────────────────────────────────────────────────── */}
      <div className="relative">

        <button onClick={() => go(-1)} aria-label="Previous projects"
          className={`${arrowCls} left-4 md:left-8`}>
          <span className={iconCls}><ChevronLeft /></span>
        </button>

        <div
          ref={wrapperRef}
          className="overflow-hidden py-6 touch-pan-y"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          }}
        >
          <div
            ref={trackRef}
            className="flex will-change-transform"
            style={{ gap: `${CARD_GAP}px` }}
          >
            {loopCards.map((project, i) => (
              <div
                key={`${project.id}-${i}`}
                style={{ width: `${CARD_WIDTH}px` }}
                className="flex-shrink-0"
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => go(1)} aria-label="Next projects"
          className={`${arrowCls} right-4 md:right-8`}>
          <span className={iconCls}><ChevronRight /></span>
        </button>

      </div>
    </section>
  );
};

export default ProjectsSection;
