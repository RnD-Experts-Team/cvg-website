import ServicesClient from "./ServicesClient";
import { getServicesSectionFromHome, getServicesPage } from "../../lib/api/home";

export default async function ServicesPage() {
  const servicesSection = await getServicesSectionFromHome();
  const servicesPage = await getServicesPage(1);
  const servicesList = servicesPage?.data ?? servicesPage ?? [];
  const title = servicesSection?.services_section?.title  ?? 'Our Services';

  return (
    <ServicesClient
      initialServices={servicesList}
      initialTitle={title}
      initialPagination={servicesPage}
    />
  );
}
