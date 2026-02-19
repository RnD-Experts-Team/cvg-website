"use client";

import React, { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { BiArrowBack } from "react-icons/bi";
import Link from "next/link";
import { projects } from "@/app/components/ProjectSections/ProjectData";

const ProjectDetail: React.FC = () => {
  const params = useParams();
  const router = useRouter();

  const id = params?.id as string;

  // ✅ Get project from single source of truth
  const project = useMemo(() => {
    return projects.find((p) => p.id === Number(id));
  }, [id]);

  // ✅ Restore scroll position when navigating back
  useEffect(() => {
    const saved = history.state?.prevScroll;
    if (typeof saved === "number") {
      requestAnimationFrame(() => window.scrollTo(0, saved));
    }
  }, []);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F8F8]">
        <div className="text-center px-6">
          <h2 className="text-2xl font-semibold mb-4">
            Project not found
          </h2>
          <p className="mb-6 text-gray-600">
            The project you're looking for does not exist.
          </p>
          <Link
            href="/projects"
            className="text-orange-500 underline"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-[#F8F8F8] min-h-screen py-50 px-6 md:px-16 lg:px-24 text-[#191919]">

      {/* Back Button + Title */}
      <div className="max-w-6xl mx-auto mb-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-3 mb-6 hover:opacity-70 transition"
        >
          <BiArrowBack size={30}  className="text-[#1E1E1E]"/>
          <h2 className="text-3xl md:text-4xl font-bold">{project.title}</h2>
        </button>

        
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-5 md:px-[94px] flex flex-col gap-10">
        <h1 className="text-3xl md:text-4xl font-bold">
          {project.title}
        </h1>

        {/* Image */}
        <div className="w-full rounded-lg overflow-hidden shadow-md">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-[250px] sm:h-[400px] md:h-[500px] object-cover"
          />
        </div>

        {/* Description */}
        <div className="max-w-3xl">
          <p className="text-gray-700 leading-relaxed text-base md:text-lg">
            {project.description}
          </p>
        </div>

      </div>
    </main>
  );
};

export default ProjectDetail;
