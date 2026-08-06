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
  title: string | null;
  description: string;
  content: string | null;
  featured: boolean;
  slug: string ;
  type: 'general' | 'design';
  icon_path: string | null;
  url: string | null;
  image: {
    url: string; // Image URL
    type?: string; // 'image' | 'video'
    mime_type?: string;
    alt_text: string;
    title: string;
  };
  created_at: string;
  updated_at: string;
};

// ── Service Category card content (General / Design) ─────────────────────
// Admin-managed title, description and icon for the two category cards shown
// on the homepage Services section and the /services?category=... pages.
export type ServiceCategory = {
  id: number;
  key: 'general' | 'design';
  title: string | null;
  description: string | null;
  icon_path: string | null;
  url: string | null; // absolute icon URL appended by the backend
  created_at?: string;
  updated_at?: string;
};

export type UpdateServiceCategoryRequest = {
  id: number;
  title: string | null;
  description: string | null;
  icon: File | null;
};

export type CreateServiceRequest = {
  title: string | null;
  description: string;
  content: string | null;
  featured: boolean;
  type?: 'general' | 'design';
  slug?: string | null;
  image: File | null;
  icon: File | null;
  alt_text?: string;
  image_title?: string;
};

export type UpdateServiceRequest = {
  id: number;
  title: string | null;
  description: string;
  content: string | null;
  featured: boolean;
  type?: 'general' | 'design';
  slug: string ;
  image: File | null;
  icon: File | null;
  alt_text?: string;
  image_title?: string;
};