"use client";

import React from "react";
import ValueCard from "./ValueCard";
import { useScrollAnimation } from "@/app/lib/useScrollAnimation";

const ValuesSection: React.FC<{ title: string }> = ({ title }) => {
  const values = [
    {
      image: "/icons/serviceIcon.png",
      title: "Lorem ipsum",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      image: "/icons/serviceIcon.png",
      title: "Lorem ipsum",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      image: "/icons/serviceIcon.png",
      title: "Lorem ipsum",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
  ];

  const cardsRef = useScrollAnimation<HTMLDivElement>({
    childSelector: ".value-card",
    from: { autoAlpha: 0, scale: 0.85, y: 30 },
    stagger: 0.15,
    duration: 0.7,
    start: "top 85%",
  });

  return (
    <section id="values" className="bg-[#1E1E1E] py-20">
      <div className="max-w-[1440px] mx-auto px-6 md:px-20">
        <h2 className="text-4xl font-bold text-[#F8F8F8] text-center mb-12">
          {title}
        </h2>

        <div ref={cardsRef} className="flex justify-center items-start flex-wrap gap-12">
          {values.map((value, index) => (
            <ValueCard
              key={index}
              image={value.image}
              title={value.title}
              description={value.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
