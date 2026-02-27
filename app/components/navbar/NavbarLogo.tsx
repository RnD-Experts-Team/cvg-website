import Image from "next/image";
import Link from "next/link";

export default function NavbarLogo({ logoUrl }: { logoUrl: string }) {
  return (
    <Link href="/" className="flex-shrink-0">
      <Image
        src={logoUrl}
        alt="logo"
        width={100}
        height={60}
        priority
        className="w-[80px] sm:w-[100px] h-auto object-contain"
      />
    </Link>
  );
}
