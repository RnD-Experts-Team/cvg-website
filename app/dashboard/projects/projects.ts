export interface Category {
  id: number;
  title: string;
  description: string;
  slug: string;
}

export interface ProjectImage {
  id?: number;
  url?: string;
  alt_text?: string;
  title?: string;
  sort_order?: number;
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