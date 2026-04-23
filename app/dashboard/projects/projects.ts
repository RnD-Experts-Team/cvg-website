export interface Category {
  id: number;
  title: string;
  description: string;
  slug: string;
}

export interface ProjectImage {
  id?: number;
  url?: string;
  path?: string;
  alt_text?: string;
  title?: string;
  sort_order?: number;
  width?: number | null;
  height?: number | null;
  /** "image" | "video" | "file" — server-detected media bucket */
  type?: "image" | "video" | "file";
  mime_type?: string | null;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  content: string;
  slug: string;
  published_at: string;
  featured: number;
  category: Category;
  images: ProjectImage[];
}

export interface ProjectSection {
  id: number;
  title: string;
  description: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}