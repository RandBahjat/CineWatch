'use client';
import { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, Maximize, SkipForward } from "lucide-react";

export default function VideoPlayer({ sourceUrl }: { sourceUrl: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    videoRef.current.requestFullscreen();
  };

  return (
    <div className="group relative w-full overflow-hidden rounded-lg bg-black">
      <video
        ref={videoRef}
        src={sourceUrl}
        className="w-full"
        onClick={togglePlay}
        disablePictureInPicture
      />
      <div className="absolute bottom-0 flex w-full items-center justify-between bg-gradient-to-t from-black/90 p-4 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="flex gap-4">
          <button onClick={togglePlay} className="text-white hover:text-primary transition-colors">
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button className="text-white hover:text-primary transition-colors">
            <SkipForward size={24} />
          </button>
        </div>
        <div className="flex gap-4">
          <button className="text-white hover:text-primary transition-colors">
            <Volume2 size={24} />
          </button>
          <button onClick={toggleFullscreen} className="text-white hover:text-primary transition-colors">
            <Maximize size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
