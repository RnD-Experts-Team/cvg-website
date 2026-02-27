"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { BiArrowBack } from "react-icons/bi";
import Link from "next/link";
import gsap from "gsap";
import type { ProjectItem } from "@/app/lib/types/cms/home";
import { ensureHttps } from "@/app/lib/utils/ensure-https";

interface Props {
  project: ProjectItem | null;
}

export default function ProjectDetailClient({ project }: Props) {
  const router = useRouter();

  const backRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);

  /* ── Entrance animation ─────────────────────────────────────────── */

  useEffect(() => {
    if (!project) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (backRef.current) {
        gsap.set(backRef.current, { autoAlpha: 0, x: -40 });
        tl.to(backRef.current, { autoAlpha: 1, x: 0, duration: 0.6 });
      }
      if (imageRef.current) {
        gsap.set(imageRef.current, { autoAlpha: 0, scale: 0.97, y: 20 });
        tl.to(
          imageRef.current,
          { autoAlpha: 1, scale: 1, y: 0, duration: 0.7 },
          "-=0.3",
        );
      }
      if (descRef.current) {
        gsap.set(descRef.current, { autoAlpha: 0, y: 25 });
        tl.to(descRef.current, { autoAlpha: 1, y: 0, duration: 0.6 }, "-=0.3");
      }
    });

    return () => ctx.revert();
  }, [project]);

  /* ── Not found ──────────────────────────────────────────────────── */

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F8F8]">
        <div className="text-center px-6">
          <h2 className="text-2xl font-semibold mb-4">Project not found</h2>
          <p className="mb-6 text-gray-600">
            The project you&apos;re looking for does not exist.
          </p>
          <Link href="/projects" className="text-orange-500 underline">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  /* ── Image URL ──────────────────────────────────────────────────── */

  const firstImage =
    project.images && project.images.length > 0 ? project.images[0] : null;
  const imageUrl = firstImage
    ? ensureHttps(
        (firstImage as any).media?.url ||
          (firstImage as any).url ||
          ((firstImage as any).media?.path
            ? `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")}/storage/${(firstImage as any).media.path}`
            : ""),
      )
    : "";

  /* ── Render ─────────────────────────────────────────────────────── */

  return (
    <main className="bg-[#F8F8F8] min-h-screen pt-32 sm:pt-36 md:pt-40 pb-16 px-4 sm:px-6 md:px-16 lg:px-24 text-[#191919]">
      {/* Back Button + Breadcrumb */}
      <div ref={backRef} className="max-w-6xl mx-auto mb-8 md:mb-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 sm:gap-3 group/back hover:opacity-70 transition"
        >
          <BiArrowBack size={24} className="text-[#1E1E1E] group-hover/back:-translate-x-1 transition-transform" />
          <span className="text-xl sm:text-2xl md:text-3xl font-bold">Back</span>
        </button>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-0 sm:px-4 md:px-12 lg:px-[94px] flex flex-col gap-6 sm:gap-8 md:gap-10">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
          {project.title}
        </h1>

        {/* Image */}
        <div
          ref={imageRef}
          className="w-full rounded-lg sm:rounded-xl overflow-hidden shadow-md bg-gray-100"
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={project.title}
              className="w-full h-[200px] sm:h-[320px] md:h-[420px] lg:h-[500px] object-cover"
            />
          ) : (
            <div className="w-full h-[200px] sm:h-[320px] md:h-[420px] lg:h-[500px] flex items-center justify-center text-gray-500">
              No image available
            </div>
          )}
        </div>

        {/* Description */}
        <div ref={descRef} className="max-w-3xl">
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg">
            {project.content}
          </p>
        </div>
      </div>
    </main>
  );
}
