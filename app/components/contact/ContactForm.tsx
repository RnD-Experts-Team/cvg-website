"use client";

import React, { useState } from "react";
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

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const endpointBase = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
  const endpoint = endpointBase ? `${endpointBase}/contact-submissions` : "/contact-submissions";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!fullName.trim() || !email.trim()) {
      setError("Please provide your name and email.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          email,
          phone_number: phone,
          project_details: details,
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (res.ok && (json.success === true || json.id || json.data)) {
        setSuccess(json.message ?? "Contact form submitted successfully.");
        setFullName("");
        setEmail("");
        setPhone("");
        setDetails("");
      } else {
        setError(json.message ?? `Submission failed (${res.status})`);
      }
    } catch (err) {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="bg-[#EEEEEE] py-20">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center mb-12 contact-animate">
          <h2 className="text-4xl font-bold text-[#1E1E1E] mb-2">{contact?.title}</h2>
          <p className="text-[#1E1E1E] text-lg">{contact?.subtitle}</p>
        </div>

        <div className="max-w-[900px] mx-auto bg-[#EEEEEE] p-8 md:p-12 contact-animate">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-6">
              {error && <div className="text-red-600">{error}</div>}
              {success && <div className="text-green-600">{success}</div>}

              <div className="bg-[#EEEEEE] border border-[#F68620] rounded-[15px] px-4 py-3">
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  type="text"
                  placeholder="Full Name"
                  className="w-full bg-transparent  outline-none   text-[#1E1E1E] placeholder-[#1E1E1E]/70"
                  required
                />
              </div>

              <div className="bg-[#EEEEEE] border border-[#F68620] rounded-[15px] px-4 py-3">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Email"
                  className="w-full bg-transparent outline-none  rounded-[15px]  text-[#1E1E1E] placeholder-[#1E1E1E]/70"
                  required
                />
              </div>

              <div className="bg-[#EEEEEE] border border-[#F68620] rounded-[15px] px-4 py-3">
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full bg-transparent outline-none  rounded-[15px]  text-[#1E1E1E] placeholder-[#1E1E1E]/70"
                />
              </div>

              <div className="bg-[#EEEEEE] border border-[#F68620] rounded-[15px] px-4 py-3">
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Project Details"
                  rows={4}
                  className="w-full bg-transparent outline-none  text-[#1E1E1E] placeholder-[#1E1E1E]/70 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-[#F68620] text-[#1E1E1E] font-bold py-3 rounded-[10px] hover:bg-[#F68F20] hover:text-white transition-colors ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {loading ? "Sending..." : "Send"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
