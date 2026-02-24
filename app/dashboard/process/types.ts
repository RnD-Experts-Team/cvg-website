// types.ts

export interface ProcessSection {
  id: number;
  title: string;
  image_media_id: number;
  created_at: string;
  updated_at: string;
  image: Image;
  steps: Step[];
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

export interface Step {
  id: number;
  process_section_id: number;
  sort_order: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}