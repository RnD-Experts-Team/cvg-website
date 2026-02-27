"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// use plain <img> for CMS remote images to avoid next/image optimization/config issues
import ContactForm from "@/app/components/contact/ContactForm";
import { ServiceItem, MediaItem } from "@/app/lib/types/cms/home";
import { GrNext, GrPrevious } from "react-icons/gr";

interface Props {
  initialServices: ServiceItem[];
  initialTitle?: string;
  sectionImage?: MediaItem | null;
  initialPagination?: any;
}

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ServicesClient({
  initialServices,
  initialTitle,
  initialPagination,
}: Props) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const [services, setServices] = useState<ServiceItem[]>(
    initialServices ?? [],
  );
  const [pagination, setPagination] = useState<any>(initialPagination ?? null);
  const [currentPage, setCurrentPage] = useState<number>(
    pagination?.current_page ?? 1,
  );
  const [lastPage, setLastPage] = useState<number>(pagination?.last_page ?? 1);
  const [title, setTitle] = useState<string>(initialTitle ?? "Our Services");

  useEffect(() => {
    if (!titleRef.current) return;
    gsap.set(titleRef.current, { autoAlpha: 0, y: -30 });
    gsap.to(titleRef.current, {
      autoAlpha: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
    });
  }, []);

  useEffect(() => {
    const container = itemsRef.current;
    if (!container) return;

    const rows = container.querySelectorAll<HTMLElement>(".service-item");
    const triggers: ScrollTrigger[] = [];

    rows.forEach((row) => {
      const textEl = row.querySelector<HTMLElement>(".service-text");
      const imgEl = row.querySelector<HTMLElement>(".service-image");

      if (textEl) {
        gsap.set(textEl, { autoAlpha: 0, x: -50 });
        triggers.push(
          ScrollTrigger.create({
            trigger: row,
            start: "top 82%",
            toggleActions: "play none none none",
            onEnter: () =>
              gsap.to(textEl, {
                autoAlpha: 1,
                x: 0,
                duration: 0.8,
                ease: "power3.out",
              }),
          }),
        );
      }

      if (imgEl) {
        gsap.set(imgEl, { autoAlpha: 0, x: 50 });
        triggers.push(
          ScrollTrigger.create({
            trigger: row,
            start: "top 82%",
            toggleActions: "play none none none",
            onEnter: () =>
              gsap.to(imgEl, {
                autoAlpha: 1,
                x: 0,
                duration: 0.8,
                ease: "power3.out",
                delay: 0.1,
              }),
          }),
        );
      }
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, [services]);

  // Client-side fetch for specific page
  async function fetchPage(page: number) {
    try {
      const base = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
      const endpointBase = base.endsWith("/api")
        ? `${base}/services`
        : `${base}/api/services`;
      const endpoint = `${endpointBase}?page=${page}`;

      const res = await fetch(endpoint);
      if (!res.ok)
        throw new Error(`Failed to fetch services page ${page}: ${res.status}`);
      const text = await res.text();
      const json = JSON.parse(text.replace(/http:\/\/cvg\.pnehomes\.com/g, 'https://cvg.pnehomes.com'));
      const pagePayload = json.data?.services ?? json.data ?? json;
      const pageData = pagePayload.data ?? pagePayload;

      setServices(pageData ?? []);
      setPagination(pagePayload);
      setCurrentPage(pagePayload?.current_page ?? page);
      setLastPage(pagePayload?.last_page ?? 1);
      // scroll to top of list
      itemsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      // ignore — keep current state
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }

  // Determine whether to show pagination: require more than one page
  // and at least 5 total services (fall back to current page length)
  const totalServicesCount =
    pagination?.total ??
    pagination?.total_items ??
    pagination?.total_count ??
    pagination?.totalRecords ??
    pagination?.total_records ??
    services.length;

  const showPagination = Boolean(pagination && lastPage > 1 && totalServicesCount >= 5);

  return (
    <section className="bg-[#F8F8F8] pt-50 ">
      <div className="max-w-[1200px] xl:max-w-[1440px] mx-auto">
        <h1
          ref={titleRef}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-[#1E1E1E] mb-14 lg:mb-20"
        >
          {title}
        </h1>

        <div ref={itemsRef} className="flex flex-col gap-16 lg:gap-24">
          {services.map((service) => {
            return (
              <article
                id={service.slug ?? String(service.id)}
                key={service.id}
                className="service-item grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-14 px-0 lg:px-35"
              >
                <div className="service-text max-w-[500px] px-5 lg:px-0">
                  <h2 className="text-2xl md:text-3xl font-bold text-[#191919] mb-6">
                    {service.title}
                  </h2>
                  <p className="text-base text-[#191919] leading-relaxed">
                    {service.content}
                  </p>
                </div>

                <div className="service-image w-full">
                  <div className="w-full h-[240px] sm:h-[300px] md:h-[340px] lg:h-[380px] rounded-lg overflow-hidden px-5 lg:px-0">
                    <img
                      src={service.image?.url?.replace('http://', 'https://')}
                      alt={service.image?.title}
                      className="w-full h-full object-cover object-center rounded-lg"
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
      {showPagination && (
        <div className="max-w-[1200px] xl:max-w-[1440px] mx-auto my-24 px-6 md:px-20">
          <div className="flex flex-col items-center gap-6">
            {/* Pagination Controls */}
            <div className="flex items-center gap-2 bg-white shadow-sm rounded-xl px-4 py-3 border">
              {/* Previous */}
              <button
                onClick={() => fetchPage(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
                className="px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200
                     hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <GrPrevious />
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: lastPage }, (_, i) => i + 1)
                  .slice(
                    Math.max(0, currentPage - 3),
                    Math.min(lastPage, currentPage + 2),
                  )
                  .map((page) => (
                    <button
                      key={page}
                      onClick={() => fetchPage(page)}
                      className={`w-9 h-9 text-sm rounded-lg transition-all duration-200
                  ${
                    page === currentPage
                      ? "bg-[#F68620] text-white shadow-md"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                    >
                      {page}
                    </button>
                  ))}
              </div>

              {/* Next */}
              <button
                onClick={() => fetchPage(Math.min(lastPage, currentPage + 1))}
                disabled={currentPage >= lastPage}
                className="px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200
                     hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <GrNext />
              </button>
            </div>

            {/* Page Info */}
            <div className="text-sm text-gray-500">
              Showing page{" "}
              <span className="font-semibold text-gray-800">{currentPage}</span>{" "}
              of <span className="font-semibold text-gray-800">{lastPage}</span>
            </div>
          </div>
        </div>
      )}
      <div className="">
        <ContactForm />
      </div>
    </section>
  );
}
