import Image from "next/image";
import { FooterSocialLink } from "@/app/lib/types/cms/home";

interface Props {
  socialMedia?: FooterSocialLink | FooterSocialLink[] | null;
}


export default function FooterSocial({ socialMedia }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="font-bold text-[20px] text-center">Social media</p>
      <div className="flex items-center gap-6 justify-center">
        {(() => {
          const items: FooterSocialLink[] = Array.isArray(socialMedia)
            ? socialMedia
            : socialMedia
            ? [socialMedia]
            : [];

          return items.map((item) => (
            <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer">
              <p>{item.platform}</p>
            </a>
          ));
        })()}
      </div>
    </div>
  );
}