"use client";

import React from "react";
import Link from "next/link";
import type { ProjectItem } from "@/app/lib/types/cms/home";
import { ensureHttps } from "@/app/lib/utils/ensure-https";

interface ProjectCardProps {
  project: ProjectItem;
  className?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, className }) => {
  const firstImage = project.images && project.images.length > 0 ? project.images[0] : null;
  const imageUrl = firstImage
    ? ensureHttps(firstImage.media?.url || firstImage.url || (firstImage.media?.path ? `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '')}/storage/${firstImage.media.path}` : ""))
    : "";
  const title = project.title;
  const description = project.description ?? undefined;
  const id = project.id;
  return (
    <div
      className={`flex flex-col rounded-[10px] overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group project-card w-full ${className ?? ""}`}
    >
      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
            <span className="px-4 text-center">No image available</span>
          </div>
        )}
      </div>
      <div className="bg-[#F68620] p-3 sm:p-4 flex flex-col items-center gap-2 sm:gap-3 flex-1">
        <h3 className="text-white font-bold text-base sm:text-lg text-center line-clamp-1">{title}</h3>
        {description && <p className="text-white/90 text-xs sm:text-sm text-center line-clamp-2">{description}</p>}
        <Link
          href={`/projects/${id}`}
          className="mt-auto bg-[#F8F8F8] text-[#1E1E1E] border border-[#F68620] px-4 py-1.5 sm:py-2 rounded-[10px] text-xs sm:text-sm font-medium transition-colors hover:bg-white"
        >
          See Details
        </Link>
      </div>
    </div>
  );
};

/* ─── Skeleton matching the card layout ───────────────────────────────── */

export const ProjectCardSkeleton: React.FC = () => (
  <div className="flex flex-col rounded-[10px] overflow-hidden shadow-lg w-full project-card">
    <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
    <div className="bg-[#F68620]/20 p-4 flex flex-col items-center gap-3">
      <div className="h-5 w-3/4 bg-gray-200/60 rounded animate-pulse" />
      <div className="h-4 w-full bg-gray-200/40 rounded animate-pulse" />
      <div className="h-9 w-24 bg-gray-200/60 rounded-[10px] animate-pulse mt-1" />
    </div>
  </div>
);

export default ProjectCard;
