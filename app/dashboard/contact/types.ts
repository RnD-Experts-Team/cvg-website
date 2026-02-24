// types.ts

export interface ContactSection {
  id: number;
  title: string;
  subtitle: string;
  created_at: string;
  updated_at: string;
}

export interface ContactSubmission {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  project_details: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
  updated_at: string;
}

export interface Image {
  id: number;
  path: string;
  type: string;
  mime_type: string;
  width: number;
  height: number;
  size_bytes: number;
  alt_text: string;
  title: string;
  created_at: string;
  updated_at: string;
  url: string;
}