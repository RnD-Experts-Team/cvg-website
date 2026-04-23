"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { BiArrowBack } from "react-icons/bi";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import type { ProjectItem } from "@/app/lib/types/cms/home";
import { ensureHttps } from "@/app/lib/utils/ensure-https";

interface Props {
  project: ProjectItem | null;
}

function resolveImageUrl(img: any): string {
  if (!img) return "";
  const raw =
    img.url ||
    img.media?.url ||
    (img.media?.path
      ? `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ?? ""}/storage/${img.media.path}`
      : img.path
        ? `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ?? ""}/storage/${img.path}`
        : "");
  return raw ? ensureHttps(raw) : "";
}

export default function ProjectDetailClient({ project }: Props) {
  const router = useRouter();

  const backRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);

  const images = useMemo(() => {
    const list = (project?.images ?? []) as any[];
    const sorted = [...list].sort(
      (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
    );
    return sorted
      .map((img) => {
        const isVideo =
          img.type === "video" ||
          (typeof img.mime_type === "string" &&
            img.mime_type.startsWith("video/"));
        return {
          url: resolveImageUrl(img),
          alt: img.alt_text || img.title || project?.title || "Project media",
          isVideo,
          mime: img.mime_type as string | undefined,
        };
      })
      .filter((i) => i.url);
  }, [project]);

  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    setActiveIdx(0);
  }, [project?.id]);

  const goPrev = useCallback(() => {
    if (images.length === 0) return;
    setActiveIdx((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const goNext = useCallback(() => {
    if (images.length === 0) return;
    setActiveIdx((i) => (i + 1) % images.length);
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext]);

  // Entrance animation
  useEffect(() => {
    if (!project) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      if (backRef.current) {
        gsap.set(backRef.current, { autoAlpha: 0, x: -40 });
        tl.to(backRef.current, { autoAlpha: 1, x: 0, duration: 0.6 });
      }
      if (galleryRef.current) {
        gsap.set(galleryRef.current, { autoAlpha: 0, scale: 0.97, y: 20 });
        tl.to(
          galleryRef.current,
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

  const currentImage = images[activeIdx];

  return (
    <main className="bg-[#F8F8F8] min-h-screen pt-32 sm:pt-36 md:pt-40 pb-16 px-4 sm:px-6 md:px-16 lg:px-24 text-[#191919]">
      {/* Back */}
      <div ref={backRef} className="max-w-6xl mx-auto mb-8 md:mb-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 sm:gap-3 group/back hover:opacity-70 transition"
        >
          <BiArrowBack
            size={24}
            className="text-[#1E1E1E] group-hover/back:-translate-x-1 transition-transform"
          />
          <span className="text-xl sm:text-2xl md:text-3xl font-bold">
            Back
          </span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-0 sm:px-4 md:px-12 lg:px-[94px] flex flex-col gap-6 sm:gap-8 md:gap-10">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
          {project.title}
        </h1>

        {/* Carousel */}
        <div ref={galleryRef} className="space-y-4">
          <div className="relative w-full rounded-lg sm:rounded-xl overflow-hidden shadow-md bg-gray-100 group">
            {currentImage ? (
              <>
                {currentImage.isVideo ? (
                  <video
                    key={currentImage.url}
                    src={currentImage.url}
                    controls
                    playsInline
                    className="w-full h-[200px] sm:h-[320px] md:h-[420px] lg:h-[500px] object-contain bg-black"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={currentImage.url}
                    src={currentImage.url}
                    alt={currentImage.alt}
                    className="w-full h-[200px] sm:h-[320px] md:h-[420px] lg:h-[500px] object-cover transition-opacity duration-300"
                  />
                )}

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={goPrev}
                      aria-label="Previous image"
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#1E1E1E] rounded-full p-2 shadow opacity-0 group-hover:opacity-100 focus:opacity-100 transition"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      aria-label="Next image"
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#1E1E1E] rounded-full p-2 shadow opacity-0 group-hover:opacity-100 focus:opacity-100 transition"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>

                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {images.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setActiveIdx(i)}
                          aria-label={`Go to image ${i + 1}`}
                          className={`h-2 rounded-full transition-all ${
                            i === activeIdx
                              ? "w-6 bg-[#F68620]"
                              : "w-2 bg-white/70 hover:bg-white"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-[200px] sm:h-[320px] md:h-[420px] lg:h-[500px] flex items-center justify-center text-gray-500">
                No image available
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {images.map((img, i) => (
                <button
                  key={img.url + i}
                  type="button"
                  onClick={() => setActiveIdx(i)}
                  aria-label={`Show media ${i + 1}`}
                  className={`relative shrink-0 rounded-md overflow-hidden border-2 transition ${
                    i === activeIdx
                      ? "border-[#F68620]"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  {img.isVideo ? (
                    <>
                      <video
                        src={img.url}
                        muted
                        playsInline
                        preload="metadata"
                        className="h-16 w-20 sm:h-20 sm:w-28 object-cover bg-black"
                      />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Play className="h-5 w-5 text-white" />
                      </span>
                    </>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={img.url}
                      alt={img.alt}
                      className="h-16 w-20 sm:h-20 sm:w-28 object-cover"
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <div ref={descRef} className="max-w-3xl">
          <div
            className="prose prose-gray max-w-none text-sm sm:text-base md:text-lg leading-relaxed
              prose-headings:text-[#1E1E1E] prose-headings:font-bold
              prose-h1:text-2xl prose-h1:sm:text-3xl
              prose-h2:text-xl prose-h2:sm:text-2xl
              prose-h3:text-lg prose-h3:sm:text-xl
              prose-p:text-gray-700 prose-p:leading-relaxed
              prose-a:text-[#F68620] prose-a:underline
              prose-strong:text-[#1E1E1E]
              prose-blockquote:border-l-[#F68620] prose-blockquote:text-gray-600
              prose-ul:list-disc prose-ol:list-decimal"
            dangerouslySetInnerHTML={{ __html: project.content || "" }}
          />
        </div>
      </div>
    </main>
  );
}
