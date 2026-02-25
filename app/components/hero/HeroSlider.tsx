"use client";

import { useState, useEffect } from "react";

interface SlideImage {
  id?: string | number;
  src: string;
  alt?: string;
}

interface Props {
  images: SlideImage[];
}

export default function HeroSlider({ images }: Props) {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="w-full h-full">
      <div
        style={{
          backgroundImage: `url(${images[currentImage]?.src ?? ''})`,
        }}
        className="w-full h-full bg-cover bg-center transition-all duration-1000"
      />
    </div>
  );
}
