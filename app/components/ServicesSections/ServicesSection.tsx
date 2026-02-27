"use client";

import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaChevronDown } from "react-icons/fa6";

import ServiceCard from "./ServiceCard";
import { ServiceItem, MediaItem } from "@/app/lib/types/cms/home";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ section: initialSection, services: initialServices }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hasScrollTriggered = useRef(false);
  const prevHeightRef = useRef<number>(0);

  const [showMore, setShowMore] = useState(false);
  const [section, setSection] = useState<any>(initialSection ?? null);
  const [services, setServices] = useState<any[]>(initialServices ?? []);

  // show 4 by default; when expanded show up to 8 cards max
  const visibleServices = showMore ? services.slice(0, 8) : services.slice(0, 4);

  /* ── Toggle with height capture (prevents scroll jump) ── */
  const toggleShowMore = () => {
    if (containerRef.current) {
      prevHeightRef.current = containerRef.current.offsetHeight;
    }
    setShowMore((prev) => !prev);
  };

  /* ── Initial scroll-triggered entrance (plays once) ── */
  useEffect(() => {
    const container = containerRef.current;
    if (!container || hasScrollTriggered.current) return;

    const cards = container.querySelectorAll(".service-card");
    if (!cards.length) return;

    gsap.set(cards, { autoAlpha: 0, y: 40 });

    gsap.to(cards, {
      autoAlpha: 1,
      y: 0,
      stagger: 0.1,
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: {
        trigger: container,
        start: "top 85%",
        toggleActions: "play none none none",
        onEnter: () => { hasScrollTriggered.current = true; },
      },
    });
  }, []);

  // If props change after hydration, update state
  useEffect(() => {
    setSection(initialSection ?? null);
  }, [initialSection]);

  useEffect(() => {
    setServices(initialServices ?? []);
  }, [initialServices]);

  /* ── Smooth height + card animation on toggle ── */
  useLayoutEffect(() => {
    if (!hasScrollTriggered.current) return;
    const container = containerRef.current;
    if (!container || prevHeightRef.current === 0) return;

    const prevH = prevHeightRef.current;
    const nextH = container.scrollHeight;
    prevHeightRef.current = 0;

    // Smoothly animate the grid container height so the button slides
    container.style.overflow = "hidden";
    gsap.fromTo(
      container,
      { height: prevH },
      {
        height: nextH,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
          container.style.height = "";
          container.style.overflow = "";
        },
      }
    );

    if (showMore) {
      // Stagger-reveal only the newly added cards
      const wrappers = container.querySelectorAll(".service-card-wrap");
      const newCards = Array.from(wrappers).slice(4);
      if (newCards.length) {
        gsap.fromTo(
          newCards,
          { autoAlpha: 0, y: 24, scale: 0.96 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            stagger: 0.09,
            duration: 0.45,
            ease: "power3.out",
            delay: 0.12,
          }
        );
      }
    }
  }, [showMore]);

  return (
    <section id="services" className="relative py-20">
      {/* Background Image */}
      <img
        src={section?.image?.url ?? '/img/bgService.png'}
        alt="Services background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/40 to-white/0"></div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#1E1E1E] mb-4">
            {section?.title ?? 'Our Services'}
          </h2>
          <p className="text-[#1E1E1E] max-w-3xl mx-auto">
            {section?.description ?? 'We offer a range of services to support your needs.'}
          </p>
        </div>

        {/* Services Grid */}
        <div
          ref={containerRef}
          className="flex flex-wrap justify-center gap-4"
        >
          {visibleServices.map((service) => (
            <div key={service.id} className="service-card-wrap w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)] xl:w-[calc(25%-0.75rem)]">
              <ServiceCard service={service} />
            </div>
          ))}
        </div>

        {/* Show More / Show Less */}
        {services.length > 4 && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={toggleShowMore}
              aria-expanded={showMore}
              className="bg-[#1E1E1E] border border-primary text-white px-6 py-3 rounded-[10px] flex items-center gap-2 hover:bg-gray-800 transition-colors"
            >
              <span>{showMore ? "Show Less" : "Show More"}</span>

              <FaChevronDown
                size={20}
                className={`transition-transform duration-300 text-[#F68620] ${
                  showMore ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;
