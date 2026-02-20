import { ContactInfo } from "./footer.types";

interface Props {
  contact?: ContactInfo[] | ContactInfo | null;
}

export default function FooterContact({ contact }: Props) {
  const items = Array.isArray(contact) ? contact : contact ? [contact] : [];

  return (
    <div className="text-center md:text-center space-y-1 text-[#1E1E1E]">
      <p className=" font-bold text-[18px] pb-[16px]">Contact Us</p>
      {items.map((item, index) => (
        <div key={index} className=" flex items-center justify-center gap-6 pb-[31px]">
          <p className=" font-semibold text-[18px] ">{item.text}</p>
          {item.phone && <a className=" font-semibold text-[18px] " href={`tel:${item.phone}`}>{item.phone}</a>}
          {item.email && <a className=" font-semibold text-[18px] " href={`mailto:${item.email}`}>{item.email}</a>}
        </div>
      ))}
    </div>
  );
}
