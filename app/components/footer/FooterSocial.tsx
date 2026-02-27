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
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.platform == "facebook" && (
                <Image
                  src="/img/facebook.png"
                  alt="Facebook"
                  width={24}
                  height={24}
                />
              )}
              {item.platform == "twitter" && (
                <Image
                  src="/img/twitter.png"
                  alt="Twitter"
                  width={24}
                  height={24}
                />
              )}
              {item.platform == "linkedin" && (
                <Image
                  src="/img/in.png"
                  alt="LinkedIn"
                  width={24}
                  height={24}
                />
              )}
              {item.platform == "instagram" && (
                <Image
                  src="/img/insta.png"
                  alt="Instagram"
                  width={24}
                  height={24}
                />
              )}
              {item.platform == "youtube" && (
                <Image
                  src="/img/youtube.png"
                  alt="YouTube"
                  width={24}
                  height={24}
                />
              )}
              {item.platform == "tiktok" && (
                <Image
                  src="/img/tiktok.png"
                  alt="TikTok"
                  width={24}
                  height={24}
                />
              )}
              {item.platform == "telegram" && (
                <Image
                  src="/img/telegram.png"
                  alt="Telegram"
                  width={24}
                  height={24}
                />
              )}
            </a>
          ));
        })()}
      </div>
    </div>
  );
}
