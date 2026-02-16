"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { FaTimes, FaBars } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";

interface Items {
  id: string | number;
  content: string;
  link: string;
}
interface ContactItem {
  content: string;
  link: string;
}

interface NavItems {
  items: Items[];
  contactItem?: ContactItem;
}

const NavBar = ({ items, contactItem }: NavItems) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // show/hide on scroll
  const [visible, setVisible] = useState(true);
  const [isFixed, setIsFixed] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY || 0;

      // hide on scroll down, show on scroll up
      if (currentY > lastScrollY.current && currentY > 50) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      lastScrollY.current = currentY;

      // when we arrive to the hero section, make the navbar fixed to top
      const hero = document.getElementById("hero");
      if (hero) {
        const heroTop = hero.offsetTop;
        if (currentY >= heroTop) {
          setIsFixed(true);
        } else {
          setIsFixed(false);
        }
      } else {
        // fallback: fix navbar once we've scrolled a little
        setIsFixed(currentY > 0);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`w-full lg:px-17.5 px-7 pt-4  bg-gradient-to-b from-[#EEEEEE] to-[rgba(248,248,248,0.5)] backdrop-blur-[5px] shadow-[0px_0px_10px_0px_#00000040] ${isFixed ? "fixed top-0 left-0 right-0 z-50" : "absolute"} ${visible ? "translate-y-0" : "-translate-y-full"} transition-transform duration-[220ms]`}
    >
      <div className=" py-[18.5px] px-[10px] flex justify-between items-center">
        <img src="/img/logo.png" alt="logo" className="w-[98px] h-[61px]" />

        <ul className=" hidden lg:flex items-center justify-center gap-[16px] ">
          {items.map((item) => (
            <li
              key={item.id}
              className="font-semibold text-[16px] cursor-pointer transition hover:text-[#F68620] "
            >
              <Link
                href={item.link}
                className={
                  pathname === item.link ? "text-[#F68620]" : "text-black"
                }
              >
                {item.content}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-3 justify-end">
          {contactItem && (
            <Link
              href={contactItem.link}
              className="bg-[#F68620] hover:bg-[#f38950] text-white rounded-[10px] py-2.5 px-4 text-[16px] font-medium"
            >
              {contactItem.content}
            </Link>
          )}
        </div>

        <button
          className="lg:hidden text-xl pl-6 text-gray-700 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>

        <div
          className={`w-full lg:hidden absolute left-0 top-[112px] text-center transform origin-top transition-all duration-300 ${menuOpen ? "opacity-100 translate-y-0 scale-100 pointer-events-auto bg-gradient-to-b from-[#EEEEEE] to-[rgba(248,248,248,0.5)] backdrop-blur-[5px] shadow-[0px_0px_10px_0px_#00000040]" : "opacity-0 -translate-y-2 scale-95 pointer-events-none"}`}
          role="menu"
          aria-hidden={!menuOpen}
        >
          <div className="min-h-120">
            <ul className="w-full">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="h-16.75 font-medium text-[16px] text-gray-800 cursor-pointer transition-colors duration-200 hover:text-[#F68620] hover:bg-[#F5F5F5] flex justify-center items-center"
                  onClick={() => setMenuOpen(false)}
                >
                  <Link href={item.link}>{item.content}</Link>
                </li>
              ))}
            </ul>

            {contactItem && (
              <div className="mt-2 flex justify-center">
                <Link
                  href={contactItem.link}
                  className="min-w-[120px] h-[40px] bg-[#F68620] hover:bg-[#f38950] text-white rounded-[10px] py-2.5 px-4 text-[18px] font-medium"
                >
                  {contactItem.content}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
