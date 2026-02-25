// lib/api/home.ts

import { HomePageData } from "../types/cms/home";

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