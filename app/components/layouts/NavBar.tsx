"use client";

import { useRef, useState } from "react";
import { usePathname } from "next/navigation";

import gsap from "gsap";
import { NavbarData } from "../navbar/navbar.types";
import NavbarLogo from "../navbar/NavbarLogo";
import NavbarLinks from "../navbar/NavbarLinks";
import NavbarMobile from "../navbar/NavbarMobile";
import { useEffect } from "react";

interface NavbarProps {
  data?: NavbarData;
}

export default function Navbar({ data: serverData }: NavbarProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isFixed, setIsFixed] = useState(false);

  const navRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  const data = serverData ?? null;

  // GSAP Scroll Behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      // Sticky navbar behavior (after hero)
      const hero = document.getElementById("hero");
      if (hero) {
        setIsFixed(currentY >= hero.offsetHeight);
      } else {
        setIsFixed(currentY > 0);
      }

      // Hide on scroll down and show on scroll up
      if (!navRef.current) return;

      if (currentY > lastScrollY.current && currentY > 100) {
        gsap.to(navRef.current, { y: "-100%", duration: 0.3 });
      } else {
        gsap.to(navRef.current, { y: "0%", duration: 0.3 });
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!data) return null;

  return (
    <div
      ref={navRef}
      className={`w-full z-50 transition-colors duration-300 bg-[linear-gradient(180deg,#EEEEEE_0%,rgba(248,248,248,0.5)_100%)] backdrop-blur-[5px] shadow-[0_0_10px_0_#00000040] ${isFixed ? "fixed top-0 left-0" : "absolute"}`}
    >
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
        
        {/* Logo */}
        <NavbarLogo logoUrl={data.logoUrl} />

        {/* Desktop Menu */}
        <NavbarLinks
          items={data.items}
          contact={data.contact}
          pathname={pathname}
        />

        {/* Contact Button */}
        <div className="hidden lg:flex justify-end">
          {data.contact && (
            <a
              href={data.contact.link}
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg transition"
            >
              {data.contact.label}
            </a>
          )}
        </div>

        {/* Mobile Menu Button */}
        <NavbarMobile
          items={data.items}
          contact={data.contact}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          pathname={pathname}
        />
      </div>
    </div>
  );
}
