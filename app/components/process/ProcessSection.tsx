"use client";

import React from "react";
import StepCard from "./StepCard";
import { useScrollAnimation } from "@/app/lib/useScrollAnimation";

const ProcessSection: React.FC = () => {
  const processData = [
    { stepNumber: "1", title: "Step One", description: "Lorem ipsum dolor sit amet." },
    { stepNumber: "2", title: "Step Two", description: "Lorem ipsum dolor sit amet." },
    { stepNumber: "3", title: "Step Three", description: "Lorem ipsum dolor sit amet." },
    { stepNumber: "4", title: "Step Four", description: "Lorem ipsum dolor sit amet." },
    { stepNumber: "5", title: "Step Five", description: "Lorem ipsum dolor sit amet." },
  ];

  const containerRef = useScrollAnimation<HTMLDivElement>({
    childSelector: ".process-card",
    from: { autoAlpha: 0, y: 50 },
    stagger: 0.15,
    duration: 0.8,
    start: "top 85%",
  });

  return (
    <section
      id="process"
      className="relative bg-cover bg-center py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{ backgroundImage: "url('/img/bgprocess.jpg')" }}
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="bg-white/10 backdrop-blur-md rounded-[25px] p-6 sm:p-8 md:p-12 border border-white/10 w-full overflow-hidden">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E1E1E] text-center mb-8 sm:mb-12">Our Process</h2>

          {/* Process Steps */}
          <div
            ref={containerRef}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-[10px] md:gap-[12px]"
          >
            {processData.map((step, index) => (
              <div key={index} className="process-card w-full">
                <StepCard
                  stepNumber={step.stepNumber}
                  title={step.title}
                  description={step.description}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
