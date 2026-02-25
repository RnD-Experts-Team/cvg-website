import { HomePageData } from "@/app/lib/types/cms/home";
import FooterSocial from "../footer/FooterSocial";
import FooterContact from "../footer/FooterContact";
import Image from "next/image";
import type { FooterData as LocalFooterData } from "@/app/components/footer/footer.types";

type Props = {
  data: HomePageData["data"]["footer"] | LocalFooterData | undefined;
};

export default function Footer({ data }: Props) {
  // Normalize data to the shapes FooterSocial/FooterContact expect (CMS types)
  let socialLinks = data && "social_links" in data ? data.social_links : undefined;
  let contact = data && "contact" in data ? (data.contact as any) : undefined;

  // If data comes from LocalFooterData, map its fields to CMS-like shapes
  if (data && "brand" in data) {
    const local = data as LocalFooterData;
    socialLinks = local.socialMedia?.map((s) => ({
      id: Number(s.id),
      platform: s.platform,
      url: s.link,
      sort_order: undefined,
      is_active: undefined,
      created_at: undefined,
      updated_at: undefined,
    }));

    // Convert contact array to a CMS-like contact object (take first)
    const first = Array.isArray(local.contact) && local.contact.length > 0 ? local.contact[0] : undefined;
    contact = first
      ? {
          id: 0,
          phone: first.phone ?? null,
          whatsapp: null,
          email: first.email ?? null,
          address: null,
          created_at: undefined,
          updated_at: undefined,
        }
      : undefined;
  }

  return (
    <footer className="bg-[#F68620] text-[#1E1E1E] p-11.5 min-h-[295px]">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="flex flex-col items-center justify-center gap-2.5 p-2">
            <Image
              src="/img/blacklogo.png"
              alt="Logo"
              width={56.77776336669922}
              height={35.447208404541016}
            />
            <p className="font-semibold text-[14px] text-center text-[#1E1E1E]">
              Commercial Vision Group
            </p>
          </div>
          <p className="font-semibold text-[21px] text-center text-[#1E1E1E]">
            © 2025 CVG Construction All rights reserved.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-[38px] lg:w-[651px]">
          <FooterSocial socialMedia={socialLinks} />
          <FooterContact contact={contact} />
        </div>
      </div>
    </footer>
  );
}