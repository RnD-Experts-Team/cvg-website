"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NavItem, NavContact } from "./navbar.types";

/**
 * After cross-page navigation, wait for the target element to appear
 * then jump to it INSTANTLY. Re-enforces scroll position multiple times
 * to beat any race with Next.js scroll restoration.
 */
function jumpToHashAfterNav(hash: string, maxWait = 4000) {
  const start = Date.now();
  let scrollCount = 0;

  const scrollTo = () => {
    const el = document.getElementById(hash);
    if (el) {
      el.scrollIntoView({ behavior: "instant", block: "start" });
      scrollCount++;
      // Re-enforce a few times to beat any async scroll-to-top from Next.js
      if (scrollCount < 5) {
        requestAnimationFrame(scrollTo);
      } else {
        history.replaceState(null, "", `/#${hash}`);
      }
    } else if (Date.now() - start < maxWait) {
      requestAnimationFrame(scrollTo);
    }
  };

  requestAnimationFrame(scrollTo);
}

interface Props {
  items: NavItem[];
  contact?: NavContact;
  pathname: string;
}

export default function NavbarLinks({ items, contact, pathname }: Props) {
  const router = useRouter();
  const [currentHash, setCurrentHash] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    setCurrentHash(window.location.hash ?? "");
    const onHash = () => setCurrentHash(window.location.hash ?? "");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  function handleAnchorClick(e: React.MouseEvent<HTMLAnchorElement>, link: string) {
    if (!link.includes("#")) return;

    const [, hash] = link.split("#");
    e.preventDefault();

    if (pathname === "/") {
      // Same page — smooth scroll directly
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `/#${hash}`);
    } else {
      // Different page — navigate home, prevent Next.js auto-scroll, then jump
      router.push(`/#${hash}`, { scroll: false });
      jumpToHashAfterNav(hash);
    }
  }

  const isActive = (item: NavItem) => {
    if (item.link.includes("#")) {
      const [, hash] = item.link.split("#");
      return pathname === "/" && currentHash === `#${hash}`;
    }
    return pathname === item.link;
  };

  return (
    <nav className="hidden lg:flex items-center gap-8">
      {items.map((item) => (
        <Link
          key={item.id}
          href={item.link}
          onClick={(e) => handleAnchorClick(e as any, item.link)}
          className={`relative font-medium transition ${
            isActive(item)
              ? "text-orange-500"
              : "text-gray-800 hover:text-orange-500"
          }`}
        >
          {item.label}
        </Link>
      ))}

      {/* contact button (if configured)
      {contact && (
        <Link
          href={contact.link}
          onClick={(e) => contact.link.includes("#") && handleAnchorClick(e as any, contact.link)}
          className={`ml-6 px-4 py-2 rounded-lg font-medium bg-orange-500 text-white hover:bg-orange-600 transition`}
        >
          {contact.label}
        </Link>
      )} */}
    </nav>
  );
} 
