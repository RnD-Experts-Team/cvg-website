"use client";

import React from "react";
import { MdConstruction, MdDesignServices } from "react-icons/md";

interface ServiceCategoryCardProps {
  categoryKey: "general" | "design";
  title: string;
  description: string;
  isActive: boolean;
  onSelect: () => void;
}

const ICONS = {
  general: MdConstruction,
  design: MdDesignServices,
};

const ServiceCategoryCard: React.FC<ServiceCategoryCardProps> = ({
  categoryKey,
  title,
  description,
  isActive,
  onSelect,
}) => {
  const Icon = ICONS[categoryKey];

  return (
    <div
      className={`service-category-card bg-[#F68620] rounded-[10px] w-full px-6 pt-10 pb-8 flex flex-col items-center text-center min-h-[300px] justify-between transition-all duration-300 hover:-translate-y-2 ${
        isActive ? "ring-4 ring-white ring-offset-4 ring-offset-transparent shadow-2xl" : "shadow-lg"
      }`}
    >
      <div className="mt-2">
        <Icon size={52} className="text-white mx-auto mb-4" />
        <h3 className="text-white font-bold text-xl mb-3">{title}</h3>
        <p className="text-white/90 text-sm leading-relaxed">{description}</p>
      </div>

      <button
        onClick={onSelect}
        className={`mt-8 px-5 py-2 rounded-[10px] text-sm font-medium transition-colors duration-200 border ${
          isActive
            ? "bg-[#1E1E1E] text-white border-[#1E1E1E] hover:bg-gray-800"
            : "bg-[#F8F8F8] text-[#1E1E1E] border-[#F8F8F8] hover:bg-white"
        }`}
      >
        {isActive ? "Hide Details" : "See Details"}
      </button>
    </div>
  );
};

export default ServiceCategoryCard;
