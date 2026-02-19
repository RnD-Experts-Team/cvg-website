"use client";

import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaChevronDown } from "react-icons/fa6";

import ServiceCard from "./ServiceCard";
import { services } from "./ServiceData";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ServicesSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hasScrollTriggered = useRef(false);

  const [showMore, setShowMore] = useState(false);

  const visibleServices = showMore ? services : services.slice(0, 4);

  const toggleShowMore = () => {
    setShowMore((prev) => !prev);
  };

  // Initial scroll-triggered animation (plays once)
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

  // Animate newly revealed cards when "Show More" is toggled
  useEffect(() => {
    if (!hasScrollTriggered.current) return;
    const container = containerRef.current;
    if (!container) return;

    const cards = container.querySelectorAll(".service-card");
    if (!cards.length) return;

    gsap.killTweensOf(cards);

    gsap.fromTo(
      cards,
      { autoAlpha: 0, y: 20 },
      {
        autoAlpha: 1,
        y: 0,
        stagger: 0.08,
        duration: 0.45,
        ease: "power3.out",
      }
    );
  }, [showMore]);

  return (
    <section id="services" className="relative py-20">
      {/* Background Image */}
      <img
        src="/img/bgService.png"
        alt="Services background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/40 to-white/0"></div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#1E1E1E] mb-4">
            Our Services
          </h2>
          <p className="text-[#1E1E1E] max-w-3xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        {/* Services Grid */}
        <div
          ref={containerRef}
          className="gap-[16px] flex justify-center items-start flex-wrap"
        >
          {visibleServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
            />
          ))}
        </div>

        {/* Show More / Show Less */}
        {services.length > 4 && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={toggleShowMore}
              aria-expanded={showMore}
              className="bg-[#1E1E1E] border border-primary text-offwhite px-6 py-3 rounded-[10px] flex items-center gap-2 hover:bg-gray-800 transition-colors"
            >
              <span>{showMore ? "Show Less" : "Show More"}</span>

              <FaChevronDown
                size={20}
                className={`transition-transform duration-200 text-[#F68620] ${
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
