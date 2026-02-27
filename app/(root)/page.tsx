import AboutSection from "../components/aboutus/AboutSection";
import ContactForm from "../components/contact/ContactForm";
import HeroClient from "../components/hero/HeroClient";
import ProcessSection from "../components/process/ProcessSection";
import ProjectsSection from "../components/ProjectSections/ProjectsSection";
import ServicesSection from "../components/ServicesSections/ServicesSection";
import ValuesSection from "../components/values/ValuesSection";
import { getHeroOnly, getAboutSection, getProcessSection, getContactSection, getServicesSectionFromHome, getServicesListFromApi } from "../lib/api/home";

export default async function Home() {
  const heroData = await getHeroOnly(); // Fetch only hero data for the client component
  const about = await getAboutSection();
  const process = await getProcessSection();
  const contact = await getContactSection();
  // Fetch services section and list from API (server-side) and pass to client component
  const servicesSection = await getServicesSectionFromHome();
  const servicesList = await getServicesListFromApi();
  return (
    <div>
      {/* HeroSection is a client component; render via client wrapper */}
      <HeroClient  heroData={heroData} />
      <ProjectsSection />
      <ServicesSection section={servicesSection?.services_section ?? null} services={servicesList} />
      <div id="value">
        <ValuesSection  />
      </div>
      <div id="process">
        <ProcessSection process={process ?? null} />
      </div>
      <div id="about">
        <AboutSection about={about ?? null} />
      </div>
      <div id="contact">
        <ContactForm contact={contact ?? null} />
      </div>
    </div>
  );
}
