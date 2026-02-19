"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import { services } from "@/app/components/ServicesSections/ServiceData";
import ContactForm from "@/app/components/contact/ContactForm";

export default function ServicesPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".service-item",
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.7,
          ease: "power3.out",
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="bg-[#F8F8F8] pt-50 ">
      <div className="max-w-[1200px] xl:max-w-[1440px] mx-auto">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-[#1E1E1E] mb-14 lg:mb-20">
          Our Services
        </h1>

        {/* Services */}
        <div ref={containerRef} className="flex flex-col gap-16 lg:gap-24">
          {services.map((service) => (
            <article
              key={service.id}
              className="service-item grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-14 px-0 lg:px-35"
            >
              {/* TEXT */}
              <div className="max-w-[500px] ">
                <h2 className="text-2xl md:text-3xl font-bold text-[#191919] mb-6">
                  {service.title}
                </h2>

                <p className="text-base text-[#191919] leading-relaxed">
                  {service.longDescription}
                </p>
              </div>

              {/* IMAGE */}
              <div className="w-full">
                <div className="relative w-full h-[240px] sm:h-[300px] md:h-[340px] lg:h-[380px] rounded-lg overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 768px) 100vw,
                           (max-width: 1024px) 90vw,
                           50vw"
                    className="object-cover"
                    priority={service.id === 1}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      {/* Contact Form */}
      <div className=" mt-[200px] ">
        <ContactForm />
      </div>
    </section>
  );
}
