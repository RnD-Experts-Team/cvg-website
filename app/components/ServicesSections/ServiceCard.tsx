import React, { forwardRef } from "react";
import Link from "next/link";
import { ServiceItem } from "@/app/lib/types/cms/home";
import { IoMdMusicalNote } from "react-icons/io";

interface ServiceCardProps {
  service: Partial<ServiceItem> & {
    title?: string;
    description?: string;
    content?: string;
    slug?: string;
    image?: any;
    icon?: any;
  };
}

const ServiceCard = forwardRef<HTMLDivElement, ServiceCardProps>(
  ({ service }, ref) => {
    
    return (
      <div
        ref={ref}
        className="service-card bg-[#F68620] rounded-[10px] w-full px-6 pt-10 pb-12 flex flex-col items-center text-center min-h-[320px] justify-between hover:-translate-y-2 transition-transform duration-300"
      >
        <div className="mt-4">
          {service?.image?.url ? (
            <img
              src={service.image.url}
              alt={service.image.title ?? service.title ?? "Service image"}
              className="w-[51px] h-[51px] object-cover rounded-md mx-auto mb-[16px]"
            />
          ) : (
            <IoMdMusicalNote size={51} className="text-[#F8F8F8] mx-auto mb-[16px]" />
          )}

          <div>
            <h3 className="text-white font-normal text-xl mb-2.5 line-clamp-1">
              {service?.title}
            </h3>
            <p className="text-white text-sm line-clamp-3">
              { service?.description ?? ""}
            </p>
          </div>
        </div>

        <Link
          href={`/services`}
          className="bg-[#F8F8F8] text-[#1E1E1E] border border-[#F8F8F8] px-4 py-2 rounded-[10px] text-sm font-medium hover:bg-gray-100 transition-colors mt-7"
        >
          See Details
        </Link>
      </div>
    );
  }
);

ServiceCard.displayName = "ServiceCard";

/* ─── Skeleton matching the service card layout ───────────────────────── */

export const ServiceCardSkeleton: React.FC = () => (
  <div className="bg-[#F68620]/20 rounded-[10px] w-full px-6 pt-10 pb-12 flex flex-col items-center text-center min-h-[320px] justify-between service-card">
    <div className="mt-4 flex flex-col items-center w-full">
      <div className="w-[51px] h-[51px] rounded-md bg-gray-200/60 animate-pulse mb-[16px]" />
      <div className="h-5 w-3/4 bg-gray-200/60 rounded animate-pulse mb-2.5" />
      <div className="h-4 w-full bg-gray-200/40 rounded animate-pulse" />
      <div className="h-4 w-5/6 bg-gray-200/40 rounded animate-pulse mt-1" />
    </div>
    <div className="h-9 w-24 bg-gray-200/60 rounded-[10px] animate-pulse mt-7" />
  </div>
);

export default ServiceCard;
