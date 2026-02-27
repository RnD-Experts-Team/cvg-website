"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BiArrowBack } from "react-icons/bi";
import Link from "next/link";
import gsap from "gsap";
import { getProjectsList } from "@/app/lib/api/home";
import type { ProjectItem } from "@/app/lib/types/cms/home";

const ProjectDetail: React.FC = () => {
  const params = useParams();
  const router = useRouter();

  const id = params?.id as string;

  const backRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);

  const [project, setProject] = useState<ProjectItem | undefined>(undefined);

  useEffect(() => {
    let mounted = true;
    if (!id) return;
    getProjectsList()
      .then((list) => {
        if (!mounted) return;
        const found = list.find((p) => p.id === Number(id));
        setProject(found);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [id]);

  // Entrance animation on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (backRef.current) {
        gsap.set(backRef.current, { autoAlpha: 0, x: -40 });
        tl.to(backRef.current, { autoAlpha: 1, x: 0, duration: 0.6 });
      }
      if (imageRef.current) {
        gsap.set(imageRef.current, { autoAlpha: 0, scale: 0.97, y: 20 });
        tl.to(imageRef.current, { autoAlpha: 1, scale: 1, y: 0, duration: 0.7 }, "-=0.3");
      }
      if (descRef.current) {
        gsap.set(descRef.current, { autoAlpha: 0, y: 25 });
        tl.to(descRef.current, { autoAlpha: 1, y: 0, duration: 0.6 }, "-=0.3");
      }
    });

    return () => ctx.revert();
  }, [project]);

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
      <div ref={backRef} className="max-w-6xl mx-auto mb-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-3 mb-6 hover:opacity-70 transition"
        >
          <BiArrowBack size={30} className="text-[#1E1E1E]" />
          <h2 className="text-3xl md:text-4xl font-bold">{project?.title}</h2>
        </button>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-5 md:px-[94px] flex flex-col gap-10">
        <h1 className="text-3xl md:text-4xl font-bold">
          {project.title}
        </h1>

        {/* Image */}
        <div ref={imageRef} className="w-full rounded-lg overflow-hidden shadow-md bg-gray-100">
          {project.images && project.images.length > 0 ? (
            (() => {
              const first = project.images[0] as any;
              const url = first.media?.url || first.url || (first.media?.path ? `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '')}/storage/${first.media.path}` : "");
              return url ? (
                <img src={url} alt={project.title} className="w-full h-[250px] sm:h-[400px] md:h-[500px] object-cover" />
              ) : (
                <div className="w-full h-[250px] sm:h-[400px] md:h-[500px] flex items-center justify-center text-gray-500">No image available</div>
              );
            })()
          ) : (
            <div className="w-full h-[250px] sm:h-[400px] md:h-[500px] flex items-center justify-center text-gray-500">
              No image available
            </div>
          )}
        </div>

        {/* Description */}
        <div ref={descRef} className="max-w-3xl">
          <p className="text-gray-700 leading-relaxed text-base md:text-lg">
            {project.content}
          </p>
        </div>

      </div>
    </main>
  );
};

export default ProjectDetail;
