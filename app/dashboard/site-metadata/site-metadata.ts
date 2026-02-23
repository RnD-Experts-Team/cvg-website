export type Media = {
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
};

export type SiteMetadata = {
  id: number;
  name: string;
  title?: string;
  description: string;
  keywords: string;
  logo_media_id?: number;
  favicon_media_id?: number;
  created_at: string;
  updated_at: string;
  logo?: Media;
  favicon?: Media;
};

export type GetSiteMetadataResponse = {
  success: boolean;
  data: SiteMetadata;
  message: string;
};

export type UpdateSiteMetadataResponse = {
  success: boolean;
  data: SiteMetadata;
  message: string;
};