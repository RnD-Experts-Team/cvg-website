"use client";

import React from "react";
import { useScrollAnimation } from "@/app/lib/useScrollAnimation";

const AboutSection: React.FC = () => {
  const textRef = useScrollAnimation<HTMLDivElement>({
    from: { autoAlpha: 0, x: -60 },
    duration: 0.9,
    animateContainer: true,
    start: "top 80%",
  });

  const imageRef = useScrollAnimation<HTMLDivElement>({
    from: { autoAlpha: 0, x: 60 },
    duration: 0.9,
    animateContainer: true,
    start: "top 80%",
  });

  return (
    <section
      id="about"
      className="bg-[#F8F8F8] py-12 px-6 md:px-20 min-h-[600px]"
    >
      <div className="max-w-[1440px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#1E1E1E]">About Us</h2>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          {/* Text Content */}
          <div
            ref={textRef}
            className="w-full md:w-1/2 text-[#1E1E1E] text-[16px] md:text-[20px] text-center  leading-[1.6] font-medium"
          >
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem
              ipsum dolor sit amet, consectetur adipiscing elit. Nulla posuere
              purus et eros placerat, vel efficitur metus suscipit.
            </p>
          </div>

          {/* Image */}
          <div ref={imageRef} className="w-full md:w-1/2 flex justify-center">
            <img
              src="/img/proCard2.png"
              alt="About Us"
              className="w-full max-w-[680px] min-h-[338px] lg:h-[338px] rounded-lg shadow-lg object-cover opacity-100"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
