// types/cms/home.ts

export interface MediaItem {
  id: number;
  path: string;
  type: string;
  mime_type: string;
  width?: number;
  height?: number;
  size_bytes?: number;
  alt_text?: string;
  title?: string;
  url: string;
}

export interface HeroMediaPivot {
  id: number;
  hero_section_id: number;
  media_id: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
  media?: MediaItem;     // assuming backend joins it – if not, adjust fetch logic
}

export interface HeroSectionCMS {
  id: number;
  title: string;
  subtitle: string;
  button_text: string;
  button_link: string;
  created_at: string;
  updated_at: string;
  media: HeroMediaPivot[];
}

export interface SiteMetadata {
  id: number;
  name: string;
  description: string;
  keywords: string;
  logo_media_id?: number;
  favicon_media_id?: number;
  logo?: MediaItem;
  favicon?: MediaItem;
}

export interface FooterContactItem {
  id: number;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  address?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface FooterSocialLink {
  id: number;
  platform: string;
  url: string;
  sort_order?: number;
  is_active?: number;
  created_at?: string;
  updated_at?: string;
}

export interface FooterSection {
  contact?: FooterContactItem | null;
  social_links?: FooterSocialLink[] | null;
}

export interface ValueItem {
  id: number;
  values_section_id?: number;
  title?: string | null;
  description?: string | null;
  media_id?: number | null;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ValuesSection {
  id?: number;
  title?: string | null;
  created_at?: string;
  updated_at?: string;
  values?: ValueItem[] | null;
}

export interface AboutSection {
  id: number;
  title?: string | null;
  description?: string | null;
  image_media_id?: number | null;
  created_at?: string;
  updated_at?: string;
  image?: MediaItem | null;
}

export interface ProcessStep {
  id: number;
  process_section_id?: number;
  sort_order?: number;
  title?: string | null;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ProcessSection {
  id: number;
  title?: string | null;
  image_media_id?: number | null;
  created_at?: string;
  updated_at?: string;
  image?: MediaItem | null;
  steps?: ProcessStep[] | null;
}

export interface ContactSection {
  id: number;
  title?: string | null;
  subtitle?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface HomePageData {
  success: boolean;
  data: {
    site_metadata: SiteMetadata;
    footer?: FooterSection;
    values_section?: ValuesSection;
    about_section?: AboutSection;
    process_section?: ProcessSection;
    contact_section?: ContactSection;
    hero: HeroSectionCMS;
    // footer, projects_section, ... (add when you implement them)
  };
  message: string;
}