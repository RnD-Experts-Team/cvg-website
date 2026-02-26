"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// use plain <img> for CMS remote images to avoid next/image optimization/config issues
import ContactForm from "@/app/components/contact/ContactForm";
import { ServiceItem, MediaItem } from "@/app/lib/types/cms/home";

interface Props {
  initialServices: ServiceItem[];
  initialTitle?: string;
  sectionImage?: MediaItem | null;
}

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ServicesClient({
  initialServices,
  initialTitle,
}: Props) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const [services, setServices] = useState<ServiceItem[]>(
    initialServices ?? [],
  );
  const [title, setTitle] = useState<string>(initialTitle ?? "Our Services");

  useEffect(() => {
    if (!titleRef.current) return;
    gsap.set(titleRef.current, { autoAlpha: 0, y: -30 });
    gsap.to(titleRef.current, {
      autoAlpha: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
    });

  }, []);

  useEffect(() => {
    const container = itemsRef.current;
    if (!container) return;

    const rows = container.querySelectorAll<HTMLElement>(".service-item");
    const triggers: ScrollTrigger[] = [];

    rows.forEach((row) => {
      const textEl = row.querySelector<HTMLElement>(".service-text");
      const imgEl = row.querySelector<HTMLElement>(".service-image");

      if (textEl) {
        gsap.set(textEl, { autoAlpha: 0, x: -50 });
        triggers.push(
          ScrollTrigger.create({
            trigger: row,
            start: "top 82%",
            toggleActions: "play none none none",
            onEnter: () =>
              gsap.to(textEl, {
                autoAlpha: 1,
                x: 0,
                duration: 0.8,
                ease: "power3.out",
              }),
          }),
        );
      }

      if (imgEl) {
        gsap.set(imgEl, { autoAlpha: 0, x: 50 });
        triggers.push(
          ScrollTrigger.create({
            trigger: row,
            start: "top 82%",
            toggleActions: "play none none none",
            onEnter: () =>
              gsap.to(imgEl, {
                autoAlpha: 1,
                x: 0,
                duration: 0.8,
                ease: "power3.out",
                delay: 0.1,
              }),
          }),
        );
      }
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
    
  }, [services]);

  return (
    <section className="bg-[#F8F8F8] pt-50 ">
      <div className="max-w-[1200px] xl:max-w-[1440px] mx-auto">
        <h1
          ref={titleRef}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-[#1E1E1E] mb-14 lg:mb-20"
        >
          {title}
        </h1>

        <div ref={itemsRef} className="flex flex-col gap-16 lg:gap-24">
          {services.map((service) => {
            return (
              <article
                id={service.slug ?? String(service.id)}
                key={service.id}
                className="service-item grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-14 px-0 lg:px-35"
              >
                <div className="service-text max-w-[500px] px-5 lg:px-0">
                  <h2 className="text-2xl md:text-3xl font-bold text-[#191919] mb-6">
                    {service.title}
                  </h2>
                  <p className="text-base text-[#191919] leading-relaxed">
                    {service.content}
                  </p>
                </div>

                <div className="service-image w-full">
                  <div className="w-full h-[240px] sm:h-[300px] md:h-[340px] lg:h-[380px] rounded-lg overflow-hidden px-5 lg:px-0">
                    <img
                      src={service.image?.url}
                      alt={service.image?.title}
                      className="w-full h-full object-cover object-center rounded-lg"
                      
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
      <div className="mt-[200px]">
        <ContactForm />
      </div>
    </section>
  );
}
