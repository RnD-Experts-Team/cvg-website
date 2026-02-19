import AboutSection from "../components/aboutus/AboutSection";
import ContactForm from "../components/contact/ContactForm";
import HeroClient from "../components/hero/HeroClient";
import ProcessSection from "../components/process/ProcessSection";
import ProjectsSection from "../components/ProjectSections/ProjectsSection";
import ServicesSection from "../components/ServicesSections/ServicesSection";
import ValuesSection from "../components/values/ValuesSection";
import { getHeroData } from "../lib/hero.service";

export default async function Home() {
  const heroData = await getHeroData();
  return (
    <div>
      {/* HeroSection is a client component; render via client wrapper */}
      <HeroClient  heroData={heroData} />
      <ProjectsSection />
      <ServicesSection />
      <div id="value">
        <ValuesSection  title="Our Values" />
      </div>
      <div id="process">
        <ProcessSection />
      </div>
      <div id="about">
        <AboutSection />
      </div>
      <div id="contact">
        <ContactForm />
      </div>
    </div>
  );
}
