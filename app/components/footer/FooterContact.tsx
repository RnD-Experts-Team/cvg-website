import { FooterContactItem } from "@/app/lib/types/cms/home";
import { getFooter } from "@/app/lib/api/home";

interface Props {
  contact?: FooterContactItem | FooterContactItem[] | null;
}

export default async function FooterContact({ contact }: Props) {
  let contactData: FooterContactItem | undefined;

  if (contact) {
    contactData = Array.isArray(contact) ? (contact[0] as FooterContactItem) : (contact as FooterContactItem);
  } else {
    const footer = await getFooter().catch(() => undefined);
    contactData = footer?.contact ?? undefined;
  }

  return (
    <div className="text-center md:text-center space-y-1 text-[#1E1E1E]">
      <p className=" font-bold text-[18px] pb-[16px]">Contact Us</p>
      {contactData && (
        <div className=" flex items-center justify-center flex-wrap gap-6 pb-[31px]">
          {contactData.phone && (
            <div className=" flex items-center gap-2">
            <p className=" font-bold text-[18px] ">phone: </p>
            <a className=" font-semibold text-[16px] " href={`tel:${contactData.phone}`}>
              {contactData.phone}
            </a>
            </div>
          )}
          {contactData.email && (
            <div className=" flex items-center gap-2">
            <p className=" font-bold text-[18px] ">email: </p>
            <a className=" font-semibold text-[16px] " href={`mailto:${contactData.email}`}>
              {contactData.email}
            </a>
            </div>
          )}
          {contactData.address && (
            <div className=" flex items-center gap-2">
            <p className=" font-bold text-[18px] ">address: </p>
            <a className=" font-semibold text-[16px] " href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactData.address)}`} target="_blank" rel="noopener noreferrer">
              {contactData.address}
            </a>
            </div>
          )}
          {contactData.whatsapp && (
            <div className=" flex items-center gap-2">
            <p className=" font-bold text-[18px] ">whatsapp: </p>
            <a className=" font-semibold text-[16px] " href={`https://wa.me/${contactData.whatsapp}`} target="_blank" rel="noopener noreferrer">
              {contactData.whatsapp}
            </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
