"use client";

import React from "react";
import ValueCard from "./ValueCard";
import { useScrollAnimation } from "@/app/lib/useScrollAnimation";
import type { ValueItem } from "@/app/lib/types/cms/home";

interface Props {
  title: string;
  values: ValueItem[] | null | undefined;
}

export default function ValuesClient({ title, values }: Props) {
  const items = values ?? [];

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
        <h2 className="text-4xl font-bold text-[#F8F8F8] text-center mb-12">{title}</h2>

        <div ref={cardsRef} className="flex justify-center items-start flex-wrap gap-12">
          {items.map((value) => (
            <ValueCard
              key={value.id}
              image={value.media?.url ?? ""}
              title={value.title ?? ""}
              description={value.description ?? ""}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
