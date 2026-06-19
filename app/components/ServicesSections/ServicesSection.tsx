"use client";

import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import ServiceCard from "./ServiceCard";
import ServiceCategoryCard from "./ServiceCategoryCard";
import { ServiceItem, MediaItem, ServiceCategoryContent, DEFAULT_SERVICE_CATEGORIES } from "@/app/lib/types/cms/home";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ── Types ────────────────────────────────────────────────────────────── */

type CategoryKey = "general" | "design";

/* ── Component ────────────────────────────────────────────────────────── */

interface ServicesSectionProps {
  section?: {
    id: number;
    title?: string | null;
    description?: string | null;
    content?: string | null;
    image_media_id?: number | null;
    button_text?: string | null;
    created_at?: string;
    updated_at?: string;
    image?: MediaItem | null;
  } | null;
  services?: ServiceItem[];
  categories?: ServiceCategoryContent[];
}

const ServicesSection: React.FC<ServicesSectionProps> = ({
  section: initialSection,
  services: initialServices,
  categories: initialCategories,
}) => {
  const [section, setSection] = useState(initialSection ?? null);
  const CATEGORIES =
    initialCategories && initialCategories.length
      ? initialCategories
      : DEFAULT_SERVICE_CATEGORIES;
  const [generalServices, setGeneralServices] = useState<ServiceItem[]>(
    initialServices ?? []
  );
  const [activeCategory, setActiveCategory] = useState<CategoryKey | null>(null);
  const [designServices, setDesignServices] = useState<ServiceItem[]>([]);
  const [loadingDesign, setLoadingDesign] = useState(false);

  const sectionRef     = useRef<HTMLElement>(null);
  const categoryRowRef = useRef<HTMLDivElement>(null);
  const subSectionRef  = useRef<HTMLDivElement>(null);
  const subGridRef     = useRef<HTMLDivElement>(null);
  const isAnimating    = useRef(false);

  /* Keep in sync if parent updates props */
  useEffect(() => { setSection(initialSection ?? null); }, [initialSection]);
  useEffect(() => { setGeneralServices(initialServices ?? []); }, [initialServices]);

  /* ── Scroll-triggered entrance for category cards ─────────────────── */
  useEffect(() => {
    const row = categoryRowRef.current;
    if (!row) return;

    const cards = row.querySelectorAll(".service-category-card");
    if (!cards.length) return;

    gsap.set(cards, { autoAlpha: 0, y: 40 });

    const st = ScrollTrigger.create({
      trigger: row,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(cards, {
          autoAlpha: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.7,
          ease: "power3.out",
        });
      },
    });

    return () => st.kill();
  }, []);

  /* ── Category select / toggle ─────────────────────────────────────── */
  const handleCategorySelect = (key: CategoryKey) => {
    if (isAnimating.current) return;

    if (key === "design" && designServices.length === 0 && !loadingDesign) {
      setLoadingDesign(true);
      const apiBase = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
      const endpoint = apiBase.endsWith("/api")
        ? `${apiBase}/services?type=design`
        : `${apiBase}/api/services?type=design`;
      fetch(endpoint)
        .then((r) => r.json())
        .then((json) => {
          const items: ServiceItem[] =
            json.data?.services?.data ?? json.data?.services ?? [];
          setDesignServices(items);
        })
        .catch(() => {})
        .finally(() => setLoadingDesign(false));
    }

    const sub = subSectionRef.current;
    if (!sub) return;

    /* Toggle off if same category clicked */
    if (activeCategory === key) {
      isAnimating.current = true;
      gsap.to(sub, {
        height: 0,
        autoAlpha: 0,
        duration: 0.35,
        ease: "power2.inOut",
        onComplete: () => {
          setActiveCategory(null);
          isAnimating.current = false;
        },
      });
      return;
    }

    const openPanel = () => {
      setActiveCategory(key);
      /* Wait a tick for React to render the new cards */
      requestAnimationFrame(() => {
        if (!subSectionRef.current || !subGridRef.current) return;

        const subCards = subGridRef.current.querySelectorAll(".service-card-wrap");

        gsap.set(sub, { height: 0, autoAlpha: 0 });
        gsap.fromTo(
          sub,
          { height: 0, autoAlpha: 0 },
          {
            height: "auto",
            autoAlpha: 1,
            duration: 0.5,
            ease: "power2.inOut",
            onComplete: () => {
              sub.style.height = "";
              isAnimating.current = false;
            },
          }
        );

        if (subCards.length) {
          gsap.fromTo(
            subCards,
            { autoAlpha: 0, y: 24, scale: 0.96 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              stagger: 0.09,
              duration: 0.45,
              ease: "power3.out",
              delay: 0.2,
            }
          );
        }
      });
    };

    /* If already open, collapse first then switch */
    if (activeCategory !== null) {
      isAnimating.current = true;
      gsap.to(sub, {
        height: 0,
        autoAlpha: 0,
        duration: 0.25,
        ease: "power2.inOut",
        onComplete: openPanel,
      });
    } else {
      isAnimating.current = true;
      openPanel();
    }
  };

  /* ── Derived data ─────────────────────────────────────────────────── */
  const activeServices: ServiceItem[] =
    activeCategory === "design"
      ? designServices
      : generalServices.slice(0, 4);

  const activeCategoryData = CATEGORIES.find((c) => c.key === activeCategory);

  /* ── Render ───────────────────────────────────────────────────────── */
  return (
    <section ref={sectionRef} id="services" className="relative py-20">
      {/* Background */}
      <img
        src={section?.image?.url ?? "/img/bgService.png"}
        alt="Services background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/40 to-white/0" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#1E1E1E] mb-4">
            {section?.title ?? "Our Services"}
          </h2>
          <p className="text-[#1E1E1E] max-w-3xl mx-auto">
            {section?.description ?? "We offer a range of services to support your needs."}
          </p>
        </div>

        {/* Category cards row */}
        <div
          ref={categoryRowRef}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto"
        >
          {CATEGORIES.map((cat) => (
            <ServiceCategoryCard
              key={cat.key}
              categoryKey={cat.key as CategoryKey}
              title={cat.title ?? ""}
              description={cat.description ?? ""}
              iconUrl={cat.url}
              isActive={activeCategory === cat.key}
              onSelect={() => handleCategorySelect(cat.key as CategoryKey)}
            />
          ))}
        </div>

        {/* Expandable sub-section */}
        <div
          ref={subSectionRef}
          className="overflow-hidden mt-10"
          style={{ height: 0, opacity: 0 }}
        >
          {/* Sub-header */}
          {activeCategoryData && (
            <div className="text-center mb-10">
              <h3 className="text-2xl sm:text-3xl font-bold text-[#1E1E1E] mb-3">
                {activeCategoryData.title ?? ""}
              </h3>
              <p className="text-[#1E1E1E] max-w-2xl mx-auto text-sm sm:text-base">
                {activeCategoryData.description ?? ""}
              </p>
            </div>
          )}

          {/* Sub-cards grid */}
          <div
            ref={subGridRef}
            className="flex flex-wrap justify-center gap-4"
          >
            {activeServices.map((svc) => (
              <div
                key={svc.id}
                className="service-card-wrap w-full sm:w-[calc(50%-0.55rem)] lg:w-[calc(25%-0.8rem)]"
              >
                <ServiceCard service={svc} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
