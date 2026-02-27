// about.service.ts

import { HttpClient } from '@/app/lib/http/http-client';
import { ContactSection, ContactSubmission } from './types';
import { getAuthToken } from '@/app/lib/http/auth';


const client = new HttpClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? '',
  getToken: getAuthToken,
});

// Get Contact Section
export const getContactSection = async (): Promise<ContactSection> => {
  return client.get<ContactSection>("/admin/contact-section");
};

// Update Contact Section
export const updateContactSection = async (data: ContactSection): Promise<ContactSection> => {
  return client.put<ContactSection>("/admin/contact-section", data);
};

// Get Contact Submissions
// Fetch a paginated list of contact submissions. Returns the raw API payload so callers
// can access pagination metadata when present.
export const getContactSubmissionsPage = async (page: number = 1): Promise<any> => {
  const res = await client.get<any>(`/admin/contact-submissions?page=${page}`);
  return res;
};

// Convenience helper for callers that expect the full list (non-paginated).
export const getContactSubmissions = async (): Promise<ContactSubmission[]> => {
  const res = await getContactSubmissionsPage(1);
  // support both { data: ContactSubmission[] } and paginated { data: { data: ContactSubmission[], ... } }
  if (res && typeof res === 'object') {
    // If API returned paginated structure under res.data.data
    if (res.data && Array.isArray(res.data)) return res.data as ContactSubmission[];
    if (res.data && res.data.data && Array.isArray(res.data.data)) return res.data.data as ContactSubmission[];
  }
  return [];
};

// Get Contact Submission by ID
export const getContactSubmissionById = async (id: number): Promise<ContactSubmission> => {
  return client.get<ContactSubmission>(`/admin/contact-submissions/${id}`);
};