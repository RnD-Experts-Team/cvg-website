export type FooterContact = {
  id?: number;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  created_at?: string;
  updated_at?: string;
};

export type SocialLink = {
  id?: number;
  platform: string;
  url: string;
  sort_order: number;
  is_active: number;
  created_at?: string;
  updated_at?: string;
};

export type FooterData = {
  contact: FooterContact;
  social_links: SocialLink[];
};

export type GetFooterResponse = {
  success: boolean;
  data: FooterData;
  message: string;
};

export type UpdateFooterResponse = {
  success: boolean;
  data: FooterData;
  message: string;
};