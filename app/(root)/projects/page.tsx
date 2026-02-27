import { getProjectsList, getCategories, getProjectsSection, getContactSection } from "@/app/lib/api/home";
import ProjectsClient from "./ProjectsClient";

export default async function ProjectsPage() {
  const [projects, categories, sectionPayload, contact] = await Promise.all([
    getProjectsList(),
    getCategories(),
    getProjectsSection(),
    getContactSection(),
  ]);

  const sec = sectionPayload?.projects_section?.projects_section;

  return (
    <ProjectsClient
      projects={projects}
      categories={categories}
      headerTitle={sec?.title ?? ""}
      headerDescription={sec?.description ?? ""}
      contact={contact ?? null}
    />
  );
}

