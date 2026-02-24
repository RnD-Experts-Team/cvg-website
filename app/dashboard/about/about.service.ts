// about.service.ts

import { HttpClient } from '@/app/lib/http/http-client';
import { AboutSection } from './types';
import { getAuthToken } from '@/app/lib/http/auth';

const client = new HttpClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? '',
  getToken: getAuthToken,
});

export const getAboutSection = async (): Promise<AboutSection> => {
  return client.get<AboutSection>("/admin/about");
};

export const updateAboutSection = async (data: AboutSection): Promise<AboutSection> => {
  return client.put<AboutSection>("/admin/about", data);
};