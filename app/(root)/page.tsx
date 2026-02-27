import AboutSection from "../components/aboutus/AboutSection";
import ContactForm from "../components/contact/ContactForm";
import HeroClient from "../components/hero/HeroClient";
import ProcessSection from "../components/process/ProcessSection";
import ProjectsSection from "../components/ProjectSections/ProjectsSection";
import ServicesSection from "../components/ServicesSections/ServicesSection";
import ValuesSection from "../components/values/ValuesSection";
import { getHeroOnly, getAboutSection, getProcessSection, getContactSection, getServicesSectionFromHome, getServicesListFromApi, getProjectsList, getProjectsSection } from "../lib/api/home";

export default async function Home() {
  const [heroData, about, process, contact, servicesSection, servicesList, projectsList, projectsSection] = await Promise.all([
    getHeroOnly(),
    getAboutSection(),
    getProcessSection(),
    getContactSection(),
    getServicesSectionFromHome(),
    getServicesListFromApi(),
    getProjectsList(),
    getProjectsSection(),
  ]);

  const projSec = projectsSection?.projects_section?.projects_section;

  return (
    <div>
      {/* HeroSection is a client component; render via client wrapper */}
      <HeroClient  heroData={heroData} />
      <ProjectsSection
        projects={projectsList}
        title={projSec?.title ?? undefined}
        description={projSec?.description ?? undefined}
      />
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
