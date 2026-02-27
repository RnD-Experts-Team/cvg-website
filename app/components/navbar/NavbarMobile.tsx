"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa";
import { useEffect, useRef } from "react";
import gsap from "gsap";
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
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
  pathname: string;
}

export default function NavbarMobile({
  items,
  contact,
  menuOpen,
  setMenuOpen,
  pathname,
}: Props) {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuRef.current) return;

    if (menuOpen) {
      gsap.to(menuRef.current, { height: "auto", opacity: 1, duration: 0.4 });
    } else {
      gsap.to(menuRef.current, { height: 0, opacity: 0, duration: 0.3 });
    }
  }, [menuOpen]);

  return (
    <>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="lg:hidden text-2xl"
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div
        ref={menuRef}
        className="lg:hidden overflow-hidden h-0 opacity-0 bg-white shadow-md absolute left-0 right-0 top-full"
      >
        <div className="flex flex-col items-center gap-6 py-6">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.link}
              onClick={(e) => {
                if (item.link.includes("#")) {
                  e.preventDefault();
                  const [, hash] = item.link.split("#");
                  if (pathname === "/") {
                    const el = document.getElementById(hash);
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    history.replaceState(null, "", `/#${hash}`);
                  } else {
                    router.push(`/#${hash}`, { scroll: false });
                    jumpToHashAfterNav(hash);
                  }
                }
                setMenuOpen(false);
              }}
              className={`text-lg ${
                pathname === item.link
                  ? "text-orange-500"
                  : "text-gray-800"
              }`}
            >
              {item.label}
            </Link>
          ))}

          {contact && (
            <Link
              href={contact.link}
              onClick={(e) => {
                if (contact.link.includes("#")) {
                  e.preventDefault();
                  const [, hash] = contact.link.split("#");
                  if (pathname === "/") {
                    const el = document.getElementById(hash);
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    history.replaceState(null, "", `/#${hash}`);
                  } else {
                    router.push(`/#${hash}`, { scroll: false });
                    jumpToHashAfterNav(hash);
                  }
                }
                setMenuOpen(false);
              }}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg"
            >
              {contact.label}
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
