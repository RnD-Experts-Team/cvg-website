"use client";

import { useState, useRef } from "react";

interface ServiceVideoPlayerProps {
  src?: string | null;
  className?: string;
}

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7 sm:w-8 sm:h-8 ml-0.5">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const ServiceVideoPlayer: React.FC<ServiceVideoPlayerProps> = ({ src, className }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.play();
  };

  return (
    <div className={`relative group ${className ?? ""}`}>
      <video
        ref={videoRef}
        src={src ?? undefined}
        className="w-full h-full object-cover object-center rounded-lg bg-black"
        playsInline
        preload="metadata"
        controls={isPlaying}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />

      {!isPlaying && (
        <button
          type="button"
          onClick={handlePlay}
          aria-label="Play video"
          className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/35 transition-colors duration-200 rounded-lg cursor-pointer"
        >
          <span className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#F68620] shadow-lg group-hover:scale-105 transition-transform duration-200">
            <PlayIcon />
          </span>
        </button>
      )}
    </div>
  );
};

export default ServiceVideoPlayer;
