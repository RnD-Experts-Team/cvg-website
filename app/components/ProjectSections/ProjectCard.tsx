"use client";

import React from "react";
import Link from "next/link";
import type { ProjectItem } from "@/app/lib/types/cms/home";

interface ProjectCardProps {
  project: ProjectItem;
  className?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, className }) => {
  const firstImage = project.images && project.images.length > 0 ? project.images[0] : null;
  const imageUrl = firstImage
    ? (firstImage.media?.url || firstImage.url || (firstImage.media?.path ? `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '')}/storage/${firstImage.media.path}` : ""))
    : "";
  const title = project.title;
  const description = project.description ?? undefined;
  const id = project.id;
  return (
    <div
      className={`flex flex-col rounded-[10px] overflow-hidden shadow-lg group project-card ${className}`}
      style={{
        width: "100%",
        maxWidth: "350px",
      }}
    >
      <div className="h-[273px] overflow-hidden bg-gray-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
            <span className="px-4 text-center">No image available</span>
          </div>
        )}
      </div>
      <div className="bg-[#F68620] p-4 flex flex-col items-center gap-3">
        <h3 className="text-offwhite font-bold text-lg">{title}</h3>
        {description && <p className="text-offwhite text-sm text-center">{description}</p>}
        <Link
          href={`/projects/${id}`}
          className="bg-[#F8F8F8] text-[#1E1E1E] border border-[#F68620] px-4 py-2 rounded-[10px] text-sm font-medium transition-colors"
        >
          See Details
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
