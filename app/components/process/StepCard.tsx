import React from "react";

interface StepCardProps {
  stepId: number;
  title: string;
  description: string;
}

const StepCard: React.FC<StepCardProps> = ({ stepId, title, description }) => {
  return (
    <div className="bg-[#F68620]/90 backdrop-blur-sm rounded-[10px] py-7 px-4 flex flex-col items-center text-center w-full min-h-[220px] sm:min-h-[279px] hover:-translate-y-2 transition-transform duration-300">
      <span className="text-white font-extrabold text-2xl sm:text-3xl md:text-4xl mb-3">0{stepId}</span>
      <h3 className="text-white font-semibold text-base sm:text-lg md:text-xl mb-2 line-clamp-1">{title}</h3>
      <p className="text-white/90 text-xs sm:text-sm md:text-base max-w-prose line-clamp-4">{description}</p>
    </div>
  );
};

/* ─── Skeleton matching the step card layout ──────────────────────────── */

export const StepCardSkeleton: React.FC = () => (
  <div className="bg-[#F68620]/30 backdrop-blur-sm rounded-[10px] py-7 px-4 flex flex-col items-center text-center w-full min-h-[220px] sm:min-h-[279px] process-card">
    <div className="h-10 w-12 bg-white/20 rounded animate-pulse mb-3" />
    <div className="h-5 w-3/4 bg-white/20 rounded animate-pulse mb-2" />
    <div className="h-4 w-full bg-white/15 rounded animate-pulse" />
    <div className="h-4 w-5/6 bg-white/15 rounded animate-pulse mt-1" />
  </div>
);

export default StepCard;
