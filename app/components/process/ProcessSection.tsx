"use client";

import React, { useEffect } from "react";
import StepCard from "./StepCard";
import { useScrollAnimation } from "@/app/lib/useScrollAnimation";
import type { HomePageData } from "@/app/lib/types/cms/home";

type Props = {
  process?: HomePageData["data"]["process_section"] | null;
};

const ProcessSection: React.FC<Props> = ({ process = null }) => {
  // Normalize and sort steps by sort_order so they render predictably
  const initialSteps = (process?.steps ?? []).slice();
  const steps = initialSteps.slice().sort((a, b) => {
    const sa = a?.sort_order ?? 0;
    const sb = b?.sort_order ?? 0;
    return sa - sb;
  });

  useEffect(() => {
    // Debug: log received process data to the browser console
    // Remove this after verifying correct shape in devtools
    // eslint-disable-next-line no-console
    console.debug("ProcessSection prop:", process);
    // eslint-disable-next-line no-console
    console.debug("Resolved steps:", steps);
  }, [process]);

  // Rely on the public `process` prop provided by the server API.
  // The server should return `process.steps` for public rendering.

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
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E1E1E] text-center mb-8 sm:mb-12">{process?.title ?? 'Our Process'}</h2>

          {/* Process Steps */}
          <div
            ref={containerRef}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-[10px] md:gap-[12px]"
          >
            {steps.length === 0 ? (
              <div className="w-full text-center py-8 text-[#1E1E1E]">No steps available</div>
            ) : (
              steps.map((step) => (
                <div key={step.id} className="process-card w-full">
                  <StepCard
                    stepId={step.id}
                    title={step.title ?? ""}
                    description={step.description ?? ""}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
