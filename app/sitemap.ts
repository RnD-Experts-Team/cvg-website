import type { MetadataRoute } from "next";
import { getProjectsList, getServicesListFromApi } from "./lib/api/home";

/**
 * Resolve the canonical site URL.
 * Priority: NEXT_PUBLIC_SITE_URL → VERCEL_PROJECT_PRODUCTION_URL → fallback.
 */
function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  
  // Fallback — update this once a custom domain is assigned
  return "https://cvg.construction";
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const now = new Date().toISOString();

  /* ── Static routes ────────────────────────────────────────────── */

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  /* ── Dynamic project routes ───────────────────────────────────── */

  let projectRoutes: MetadataRoute.Sitemap = [];

  try {
    const projects = await getProjectsList();

    projectRoutes = projects.map((project) => ({
      url: `${baseUrl}/projects/${project.id}`,
      lastModified: project.updated_at
        ? new Date(project.updated_at).toISOString()
        : now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error("[sitemap] Failed to fetch projects:", error);
  }

  /* ── Combine & return ─────────────────────────────────────────── */

  return [...staticRoutes, ...projectRoutes];
}
