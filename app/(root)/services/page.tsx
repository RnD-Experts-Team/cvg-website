import ServicesClient from "./ServicesClient";
import { getServicesSectionFromHome, getServicesPage, getServiceCategories } from "../../lib/api/home";

export default async function ServicesPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string }> | { category?: string };
}) {
  const params = searchParams instanceof Promise ? await searchParams : searchParams;
  const category = params?.category === "design" ? "design" : "general";

  const [servicesSection, serviceCategories] = await Promise.all([
    getServicesSectionFromHome(),
    getServiceCategories(),
  ]);

  // Admin-managed content for the active category card (title + description).
  const categoryContent = serviceCategories.find((c) => c.key === category);

  if (category === "design") {
    const servicesPage = await getServicesPage(1, "design");
    const raw: any[] = servicesPage?.data ?? servicesPage ?? [];
    const servicesList = (Array.isArray(raw) ? raw : []).filter(
      (s: any) => s?.type === "design"
    );
    return (
      <ServicesClient
        initialServices={servicesList}
        initialTitle={categoryContent?.title || "Design Services"}
        initialDescription={categoryContent?.description ?? ""}
        initialPagination={servicesPage}
        category="design"
      />
    );
  }

  const servicesPage = await getServicesPage(1, "general");
  const raw: any[] = servicesPage?.data ?? servicesPage ?? [];
  const servicesList = (Array.isArray(raw) ? raw : []).filter(
    (s: any) => !s?.type || s?.type === "general"
  );
  const title =
    categoryContent?.title ||
    servicesSection?.services_section?.title ||
    "Our Services";

  return (
    <ServicesClient
      initialServices={servicesList}
      initialTitle={title}
      initialDescription={categoryContent?.description ?? ""}
      initialPagination={servicesPage}
      category="general"
    />
  );
}
