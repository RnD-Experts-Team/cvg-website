import React from "react";

interface StepCardProps {
  stepId: number;
  title: string;
  description: string;
}

const StepCard: React.FC<StepCardProps> = ({ stepId, title, description }) => {
  return (
    <div className="bg-[#F68620]/90 backdrop-blur-sm rounded-[10px] py-7 px-4 flex flex-col items-center text-center w-full  h-auto sm:h-[279px] max-h-[280px] opacity-100 rotate-0 flex-none hover:-translate-y-2 transition-transform duration-300">
      <span className="text-[#1E1E1E] font-extrabold text-2xl sm:text-3xl md:text-4xl mb-3">0{stepId}</span>
      <h3 className="text-[#1E1E1E] font-semibold text-base sm:text-lg md:text-xl mb-2">{title}</h3>
      <p className="text-[#1E1E1E] text-xs sm:text-sm md:text-base max-w-prose">{description}</p>
    </div>
  );
};

export default StepCard;
