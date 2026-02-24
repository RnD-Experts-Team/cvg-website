// service.ts

import { HttpClient } from '@/app/lib/http/http-client';
import { ProcessSection, Step } from './types';
import { getAuthToken } from '@/app/lib/http/auth';

const client = new HttpClient({
      baseUrl: process.env.NEXT_PUBLIC_API_URL ?? '',
      getToken: getAuthToken,
    });
export const getProcessSection = async (): Promise<ProcessSection> => {
  return client.get<ProcessSection>("/admin/process");
};

export const updateProcessSection = async (data: ProcessSection): Promise<ProcessSection> => {
  return client.put<ProcessSection>("/admin/process", data);
};