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
export const getContactSubmissions = async (): Promise<ContactSubmission[]> => {
  const res = await client.get<{ data: ContactSubmission[] }>("/admin/contact-submissions");
  return res.data;
};

// Get Contact Submission by ID
export const getContactSubmissionById = async (id: number): Promise<ContactSubmission> => {
  return client.get<ContactSubmission>(`/admin/contact-submissions/${id}`);
};