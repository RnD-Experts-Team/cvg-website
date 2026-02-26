import ServicesClient from "./ServicesClient";
import { getServicesSectionFromHome, getServicesListFromApi } from "../../lib/api/home";

export default async function ServicesPage() {
  const servicesSection = await getServicesSectionFromHome();
  const servicesList = await getServicesListFromApi();
  const title = servicesSection?.services_section?.title  ?? 'Our Services';

  return (
    <ServicesClient
      initialServices={servicesList}
      initialTitle={title}
      
    />
  );
}
