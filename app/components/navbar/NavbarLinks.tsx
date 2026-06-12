"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaChevronDown } from "react-icons/fa6";
import { NavItem, NavContact } from "./navbar.types";

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
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `/#${hash}`);
    } else {
      router.push(`/#${hash}`, { scroll: false });
      jumpToHashAfterNav(hash);
    }
  }

  function scrollToHash(hash: string) {
    if (pathname === "/") {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `/#${hash}`);
    } else {
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
      {items.map((item) => {
        /* ── Services dropdown ── */
        if (item.label === "Services") {
          const servicesActive =
            pathname === "/" && currentHash === "#services";

          return (
            <div key={item.id} className="relative group">
              {/* Trigger button — dropdown opens on hover; click does nothing */}
              <button
                type="button"
                className={`relative font-medium transition flex items-center gap-1 ${
                  servicesActive
                    ? "text-orange-500"
                    : "text-gray-800 hover:text-orange-500"
                }`}
              >
                {item.label}
                <FaChevronDown
                  size={11}
                  className="mt-0.5 transition-transform duration-300 group-hover:rotate-180"
                />
              </button>

              {/* Dropdown panel */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 translate-y-1 group-hover:translate-y-0 z-50">
                <div className="bg-white shadow-xl rounded-xl py-2 min-w-[160px] border border-gray-100">
                  <button
                    onClick={() => router.push("/services?category=general")}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:text-orange-500 hover:bg-orange-50 transition-colors"
                  >
                    General
                  </button>
                  <button
                    onClick={() => router.push("/services?category=design")}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:text-orange-500 hover:bg-orange-50 transition-colors"
                  >
                    Design
                  </button>
                </div>
              </div>
            </div>
          );
        }

        /* ── Regular link ── */
        return (
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
        );
      })}
    </nav>
  );
}
