// types.ts

export interface AboutSection {
  id: number;
  title: string;
  description: string;
  image_media_id: number;
  created_at: string;
  updated_at: string;
  image: Image;
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