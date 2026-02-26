// lib/api/home.ts

import { HomePageData } from "../types/cms/home";
import type { ProjectItem, CategoryItem, ServiceItem, MediaItem } from "../types/cms/home";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

if (!API_BASE) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined in environment variables");
}

export async function getHomeData(options: { revalidate?: number } = {}): Promise<HomePageData> {
  const { revalidate = 300 } = options; // default 5 minutes

  const base = API_BASE.replace(/\/$/, '');
  const endpoint = base.endsWith('/api') ? `${base}/home` : `${base}/api/home`;

  const res = await fetch(endpoint, {
    next: { revalidate },
    // cache: 'force-cache',     // uncomment if you want static-like caching
    // cache: 'no-store',        // uncomment for always fresh
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch home data: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// Optional: more specific helpers if needed later
export async function getHeroOnly(): Promise<HomePageData["data"]["hero"]> {
  const data = await getHomeData({ revalidate: 180 }); // shorter for hero if it changes more often
  return data.data.hero;
}

export async function getSiteMetadata(): Promise<HomePageData["data"]["site_metadata"]> {
  const data = await getHomeData({ revalidate: 3600 }); // longer — metadata rarely changes
  return data.data.site_metadata;
}

export async function getFooter(): Promise<HomePageData["data"]["footer"] | undefined> {
  const data = await getHomeData({ revalidate: 3600 });
  return data.data.footer;
}

export async function getValuesSection(): Promise<HomePageData["data"]["values_section"] | undefined> {
  const data = await getHomeData({ revalidate: 3600 });
  return data.data.values_section;
}
export async function getAboutSection(): Promise<HomePageData["data"]["about_section"] | undefined> {
  const data = await getHomeData({ revalidate: 3600 });
  return data.data.about_section;
}
export async function getProcessSection(): Promise<HomePageData["data"]["process_section"] | undefined> {
  const data = await getHomeData({ revalidate: 3600 });
  return data.data.process_section;
}
export async function getContactSection(): Promise<HomePageData["data"]["contact_section"] | undefined> {
  const data = await getHomeData({ revalidate: 3600 });
  return data.data.contact_section;
}

export async function getProjectsSection(): Promise<{ projects_section: HomePageData["data"]["projects_section"] | undefined }> {
  const data = await getHomeData({ revalidate: 600 });
  return { projects_section: data.data.projects_section };
}

export async function getProjectsList(): Promise<ProjectItem[]> {
  const payload = await getHomeData({ revalidate: 600 });
  const projects = payload.data.projects_section?.projects ?? [];

  // Enrich project images with media details (if API exposes a media endpoint)
  const base = API_BASE.replace(/\/$/, '');
  const mediaEndpointBase = base.endsWith('/api') ? `${base}` : `${base}/api`;

  // collect unique media_ids
  const mediaIds = new Set<number>();
  for (const p of projects) {
    if (Array.isArray(p.images)) {
      for (const img of p.images) {
        if (img && typeof img.media_id === 'number') mediaIds.add(img.media_id);
      }
    }
  }

  if (mediaIds.size === 0) return projects;

  const idArray = Array.from(mediaIds);
  // fetch media details in parallel
  const mediaFetches = idArray.map((id) => fetch(`${mediaEndpointBase}/media/${id}`, { next: { revalidate: 3600 } }).then(async (r) => {
    if (!r.ok) return null;
    try {
      const j = await r.json();
      return j.data ?? null;
    } catch {
      return null;
    }
  }).catch(() => null));

  const mediaResults = await Promise.all(mediaFetches);
  const mediaMap = new Map<number, any>();
  idArray.forEach((id, idx) => {
    if (mediaResults[idx]) mediaMap.set(id, mediaResults[idx]);
  });

  // attach media object (if found) to each image entry as `media`
  for (const p of projects) {
    if (Array.isArray(p.images)) {
      for (const img of p.images) {
        if (img && typeof img.media_id === 'number') {
          const m = mediaMap.get(img.media_id);
          if (m) img.media = m;
          else img.media = img.media ?? null;
        }
      }
    }
  }

  return projects;
}

export async function getCategories(): Promise<CategoryItem[]> {
  const base = API_BASE.replace(/\/$/, '');
  const endpoint = base.endsWith('/api') ? `${base}/categories` : `${base}/api/categories`;

  const res = await fetch(endpoint, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`Failed to fetch categories: ${res.status}`);
  const json = await res.json();
  return json.data ?? [];
}

export async function getProjectBySlug(slug: string): Promise<ProjectItem | undefined> {
  const base = API_BASE.replace(/\/$/, '');
  const endpoint = base.endsWith('/api') ? `${base}/${slug}` : `${base}/api/projects/${slug}`;

  const res = await fetch(endpoint, { next: { revalidate: 300 } });
  if (!res.ok) return undefined;
  const json = await res.json();
  return json.data as ProjectItem | undefined;
}

// Services helpers
export async function getServicesSectionFromHome(): Promise<
  HomePageData['data']['services_section'] | undefined
> {
  const data = await getHomeData({ revalidate: 600 });
  return data.data.services_section;
}


export async function getServicesListFromApi(): Promise<ServiceItem[]> {
  const base = API_BASE.replace(/\/$/, '');
  const endpoint = base.endsWith('/api') ? `${base}/services` : `${base}/api/services`;

  const res = await fetch(endpoint, { next: { revalidate: 600 } });
  if (!res.ok) throw new Error(`Failed to fetch services: ${res.status}`);
  const json = await res.json();

  // API returns services under json.data.services.data (paginated) or json.data.services
  const services: ServiceItem[] = json.data?.services?.data ?? json.data?.services ?? [];

  // collect unique image_media_id values to fetch media details
  const mediaIds = new Set<number>();
  for (const s of services) {
    if (s && typeof s.image_media_id === 'number') mediaIds.add(s.image_media_id);
  }

  if (mediaIds.size === 0) return services;

  const idArray = Array.from(mediaIds);
  const mediaEndpointBase = base.endsWith('/api') ? `${base}` : `${base}/api`;

  const mediaFetches = idArray.map((id) =>
    fetch(`${mediaEndpointBase}/media/${id}`, { next: { revalidate: 3600 } })
      .then(async (r) => {
        if (!r.ok) return null;
        try {
          const j = await r.json();
          return (j.data ?? null) as MediaItem | null;
        } catch {
          return null;
        }
      })
      .catch(() => null),
  );

  const mediaResults = await Promise.all(mediaFetches);
  const mediaMap = new Map<number, MediaItem>();
  idArray.forEach((id, idx) => {
    if (mediaResults[idx]) mediaMap.set(id, mediaResults[idx] as MediaItem);
  });

  // attach media object to each service as `image` when available
  for (const s of services) {
    if (s && typeof s.image_media_id === 'number') {
      const m = mediaMap.get(s.image_media_id);
      if (m) s.image = m;
      else s.image = s.image ?? null;
    }
  }

  return services;
}