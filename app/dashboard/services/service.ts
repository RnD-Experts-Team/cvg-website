export type ServiceSection = {
  success: boolean;
  data: {
    id: number;
    title: string;
    description: string;
    content: string | null;
    image_media_id: number | null;
    button_text: string;
    created_at: string;
    updated_at: string;
    image: {
      id: number;
      url: string; // Image URL field
      alt_text: string;
      title: string;
    };
  };
  message: string;
};

// The actual section payload returned in `data` above
export type ServiceSectionData = ServiceSection['data'];

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export type Service = {
  id: number;
  title: string;
  description: string;
  content: string | null;
  featured: boolean;
  slug: string;
  image: {
    url: string; // Image URL
    alt_text: string;
    title: string;
  };
  created_at: string;
  updated_at: string;
};

export type CreateServiceRequest = {
  title: string;
  description: string;
  content: string | null;
  featured: boolean;
  slug: string;
  image: File | null;
  alt_text?: string;
  image_title?: string;
};

export type UpdateServiceRequest = {
  id: number;
  title: string;
  description: string;
  content: string | null;
  featured: boolean;
  slug: string;
  image: File | null;
  alt_text?: string;
  image_title?: string;
};