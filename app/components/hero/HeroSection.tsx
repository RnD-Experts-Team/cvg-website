import { useEffect, useState, useRef } from "react";
import { HeroData, HeroVideo } from "./hero.types";
import gsap from "gsap";

interface Props {
  heroData: HeroData;
}

export default function HeroSection({ heroData }: Props) {
  const [isVideoBackground, setIsVideoBackground] = useState(false);
  const hasAnimated = useRef(false);  // Reference to track if the animation has run

  useEffect(() => {
    // If background is a video, show it
    if ("src" in heroData.background) {
      setIsVideoBackground(true);
    }
  }, [heroData]);

  // GSAP for animating content
  useEffect(() => {
    if (!hasAnimated.current) {
      // Run the animation only once
      gsap.from(".hero-content", {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.5,
        ease: "power4.out",
      });
      hasAnimated.current = true;  // Set the ref to true after the first animation
    }
  }, []);

  return (
    <section id="hero" className="relative w-full h-[100vh]">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full">
        {isVideoBackground && (
          <video
            src={(heroData.background as HeroVideo).src}
            autoPlay
            loop
            muted
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Content */}
      <div className="hero-content absolute z-20 flex items-center justify-center w-full h-full text-center text-white px-4">
        <div className="w-full max-w-[1000px] lg:h-[258px] h-auto px-6 sm:px-8 md:px-12 py-8 md:py-10 rounded-[25px] bg-[rgba(0,0,0,0.55)]  flex flex-col justify-center gap-6 mx-auto min-w-0">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">Commercial <span className=" text-[#F68620]">Vision</span> Group</h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white max-w-prose mx-auto">{heroData.subtitle}</p>
          <div className="flex justify-center w-full">
            <a
              href={heroData.contactLink}
              aria-label={heroData.contactLabel}
              className="bg-[#F68620] text-white text-sm sm:text-base md:text-lg py-2.5 sm:py-3 px-6 sm:px-8 rounded-[10px] hover:bg-orange-600 transition-all w-full sm:w-auto text-center"
            >
              {heroData.contactLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
