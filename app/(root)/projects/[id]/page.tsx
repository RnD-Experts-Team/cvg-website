import { getProjectsList } from "@/app/lib/api/home";
import ProjectDetailClient from "./ProjectDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const projects = await getProjectsList();
  const project = projects.find((p) => p.id === Number(id)) ?? null;

  return <ProjectDetailClient project={project} />;
}

