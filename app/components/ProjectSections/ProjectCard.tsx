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
  const firstImage =
    project.images && project.images.length > 0 ? project.images[0] : null;

  const imageUrl = firstImage
    ? ensureHttps(
        firstImage.media?.url ||
          firstImage.url ||
          (firstImage.media?.path
            ? `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")}/storage/${firstImage.media.path}`
            : ""),
      )
    : "";

  const isVideo =
    !!firstImage &&
    (firstImage.type === "video" ||
      (typeof firstImage.mime_type === "string" &&
        firstImage.mime_type.startsWith("video/")) ||
      (typeof firstImage.media?.mime_type === "string" &&
        firstImage.media.mime_type.startsWith("video/")));

  const { title, description, id } = project;

  return (
    <div
      className={[
        "project-card",
        "flex flex-col w-full h-[380px]",
        "rounded-[12px] overflow-hidden",
        "shadow-md hover:shadow-xl",
        "transition-shadow duration-300",
        "group",
        className ?? "",
      ].join(" ")}
    >
      {/* ── Image / video ─────────────────────────────────────────── */}
      <div className="relative h-[220px] flex-shrink-0 overflow-hidden bg-gray-100">
        {imageUrl ? (
          isVideo ? (
            <video
              src={imageUrl}
              muted
              loop
              playsInline
              autoPlay
              preload="metadata"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 bg-black"
            />
          ) : (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
            <svg
              className="w-10 h-10 opacity-40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={1.5} />
              <circle cx="8.5" cy="8.5" r="1.5" strokeWidth={1.5} />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}

        {/* Subtle hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* ── Info bar ──────────────────────────────────────────────── */}
      <div className="flex-1 bg-[#F68620] px-4 pt-4 pb-4 flex flex-col items-center">
        {/* Title — always 1 line */}
        <h3 className="text-white font-bold text-[15px] sm:text-base text-center line-clamp-1 w-full leading-snug">
          {title}
        </h3>

        {/* Description — always reserves 2 lines of space */}
        <p className="mt-2 text-white/85 text-xs sm:text-[13px] text-center line-clamp-2 w-full min-h-[2.5rem] leading-[1.25rem]">
          {description ?? ""}
        </p>

        {/* Button — pinned to bottom */}
        <Link
          href={`/projects/${id}`}
          className="mt-auto bg-white text-[#1E1E1E] border border-white/30
                     px-5 py-[7px] rounded-[8px] text-xs sm:text-sm font-semibold
                     transition-all duration-200
                     hover:bg-[#1E1E1E] hover:text-white hover:border-[#1E1E1E]"
        >
          See Details
        </Link>
      </div>
    </div>
  );
};

/* ── Skeleton ──────────────────────────────────────────────────────── */

export const ProjectCardSkeleton: React.FC = () => (
  <div className="project-card flex flex-col w-full h-[380px] rounded-[12px] overflow-hidden shadow-md">
    <div className="h-[220px] flex-shrink-0 bg-gray-200 animate-pulse" />
    <div className="flex-1 bg-[#F68620]/20 px-4 pt-4 pb-4 flex flex-col items-center gap-2">
      <div className="h-5 w-3/4 bg-gray-200/60 rounded animate-pulse" />
      <div className="h-4 w-full bg-gray-200/40 rounded animate-pulse mt-1" />
      <div className="h-4 w-5/6 bg-gray-200/40 rounded animate-pulse" />
      <div className="h-9 w-28 bg-gray-200/60 rounded-[8px] animate-pulse mt-auto" />
    </div>
  </div>
);

export default ProjectCard;
