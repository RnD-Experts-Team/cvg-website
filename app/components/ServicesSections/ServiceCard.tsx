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
        className="service-card bg-[#F68620] rounded-[10px] w-full max-w-[260px] sm:w-[250px] px-6 sm:px-[46px] pt-10 pb-12 flex flex-col items-center text-center h-[320px] flex-none justify-between hover:-translate-y-2 transition-transform duration-300"
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
            <h3 className="text-offwhite font-normal text-xl mb-2.5">
              {service?.title}
            </h3>
            <p className="text-offwhite text-sm">
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
export default ServiceCard;
