import ServicesClient from "./ServicesClient";
import { getServicesSectionFromHome, getServicesPage } from "../../lib/api/home";

export default async function ServicesPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string }> | { category?: string };
}) {
  const params = searchParams instanceof Promise ? await searchParams : searchParams;
  const category = params?.category === "design" ? "design" : "general";

  const servicesSection = await getServicesSectionFromHome();

  if (category === "design") {
    const servicesPage = await getServicesPage(1, "design");
    const servicesList = servicesPage?.data ?? servicesPage ?? [];
    return (
      <ServicesClient
        initialServices={servicesList}
        initialTitle="Design Services"
        initialPagination={servicesPage}
        category="design"
      />
    );
  }

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
