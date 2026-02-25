"use client";

import React from "react";
import { useScrollAnimation } from "@/app/lib/useScrollAnimation";
import type { HomePageData } from "@/app/lib/types/cms/home";

type Props = {
  contact?: HomePageData["data"]["contact_section"] | null;
};

const ContactForm: React.FC<Props> = ({ contact = null }) => {
  const sectionRef = useScrollAnimation<HTMLElement>({
    childSelector: ".contact-animate",
    from: { autoAlpha: 0, y: 40 },
    stagger: 0.15,
    duration: 0.8,
    start: "top 80%",
  });

  return (
    <section id="contact" ref={sectionRef} className="bg-[#EEEEEE] py-20">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center mb-12 contact-animate">
          <h2 className="text-4xl font-bold text-[#1E1E1E] mb-2">{contact?.title }</h2>
          <p className="text-[#1E1E1E] text-lg">{contact?.subtitle}</p>
        </div>

        <div className="max-w-[900px] mx-auto bg-[#EEEEEE] p-8 md:p-12 contact-animate">
          <form className="space-y-6" suppressHydrationWarning>
            <div className="space-y-6">
              {/* Full Name */}
              <div className="bg-[#EEEEEE] border border-[#F68620] rounded-[15px] px-4 py-3">
                <input type="text" placeholder="Full Name" className="w-full bg-transparent  outline-none   text-[#1E1E1E] placeholder-[#1E1E1E]/70" />
              </div>

              {/* Email */}
              <div className="bg-[#EEEEEE] border border-[#F68620] rounded-[15px] px-4 py-3">
                <input type="email" placeholder="Email" className="w-full bg-transparent outline-none  rounded-[15px]  text-[#1E1E1E] placeholder-[#1E1E1E]/70" />
              </div>

              {/* Phone Number */}
              <div className="bg-[#EEEEEE] border border-[#F68620] rounded-[15px] px-4 py-3">
                <input type="tel" placeholder="Phone Number" className="w-full bg-transparent outline-none  rounded-[15px]  text-[#1E1E1E] placeholder-[#1E1E1E]/70" />
              </div>

              {/* Project Details */}
              <div className="bg-[#EEEEEE] border border-[#F68620] rounded-[15px] px-4 py-3">
                <textarea placeholder="Project Details" rows={4} className="w-full bg-transparent outline-none  text-[#1E1E1E] placeholder-[#1E1E1E]/70 resize-none"></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                suppressHydrationWarning
                className="w-full bg-[#F68620] text-[#1E1E1E] font-bold py-3 rounded-[10px] hover:bg-[#F68F20] hover:text-white transition-colors"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
