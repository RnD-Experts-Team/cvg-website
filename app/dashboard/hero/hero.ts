export interface HeroMediaItem {
  id: number;
  sort_order: number;
  media: {
    id: number;
    url: string;
    alt_text: string;
    title: string;
    mime_type?: string;
  };
}

export interface HeroSection {
  id: number;
  title: string;
  subtitle: string;
  button_text: string;
  button_link: string;
  media: HeroMediaItem[];
}

export interface GetHeroResponse {
  success: boolean;
  data: HeroSection;
  message: string;
}

export interface UpdateHeroResponse {
  success: boolean;
  data: HeroSection;
  message: string;
}