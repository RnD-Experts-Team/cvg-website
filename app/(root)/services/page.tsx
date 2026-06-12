import ServicesClient from "./ServicesClient";
import { getServicesSectionFromHome, getServicesPage } from "../../lib/api/home";
import type { ServiceItem } from "../../lib/types/cms/home";

const DESIGN_MOCK: ServiceItem[] = [
  {
    id: 9901,
    title: "Interior Design",
    content:
      "Full interior space planning and material selection tailored for high-impact commercial environments. We work with you to define a spatial concept, select finishes, and produce a complete interior package ready for build.",
    slug: "interior-design",
  },
  {
    id: 9902,
    title: "Architectural Drafting",
    content:
      "Detailed architectural plans, elevations, and technical drawings prepared to permit-ready standard. Our drafting team translates your brief into clear, buildable documents that contractors can work from day one.",
    slug: "architectural-drafting",
  },
  {
    id: 9903,
    title: "3D Visualization",
    content:
      "Photorealistic renders and walkthroughs that let you experience your space before a single wall goes up. Catch design issues early, align stakeholders faster, and walk into construction with full confidence.",
    slug: "3d-visualization",
  },
  {
    id: 9904,
    title: "Space Planning",
    content:
      "Optimised floor plan layouts that maximise traffic flow, seating capacity, and operational efficiency. From restaurant floor plans to retail layouts, we ensure every square foot works hard for your business.",
    slug: "space-planning",
  },
];

export default async function ServicesPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string }> | { category?: string };
}) {
  const params = searchParams instanceof Promise ? await searchParams : searchParams;
  const category = params?.category === "design" ? "design" : "general";

  if (category === "design") {
    return (
      <ServicesClient
        initialServices={DESIGN_MOCK}
        initialTitle="Design Services"
        initialPagination={null}
        category="design"
      />
    );
  }

  const servicesSection = await getServicesSectionFromHome();
  const servicesPage = await getServicesPage(1);
  const servicesList = servicesPage?.data ?? servicesPage ?? [];
  const title = servicesSection?.services_section?.title ?? "Our Services";

  return (
    <ServicesClient
      initialServices={servicesList}
      initialTitle={title}
      initialPagination={servicesPage}
      category="general"
    />
  );
}
