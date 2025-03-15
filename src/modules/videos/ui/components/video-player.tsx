"use client";

import MuxPlayer from "@mux/mux-player-react";

import { THUMBNAIL_FALLBACK } from "@/lib/constants";

interface VideoPlayerProps {
  playbackId?: string | null | undefined;
  thumbnailUrl?: string | null | undefined;
  autoPlay?: boolean;
  onPlay?: () => void;
}

const VideoPlayer = ({
  autoPlay,
  onPlay,
  playbackId,
  thumbnailUrl,
}: VideoPlayerProps) => {
  return (
    <MuxPlayer
      playbackId={playbackId || ""}
      poster={thumbnailUrl || THUMBNAIL_FALLBACK}
      playerInitTime={0}
      autoPlay={autoPlay}
      thumbnailTime={0}
      className="w-full h-full object-contain"
      accentColor="#ff0000"
      onPlay={onPlay}
    />
  );
};

const VideoPlayerSkeleton = () => {
  return <div className="aspect-video bg-black rounded-xl" />;
};

export { VideoPlayer, VideoPlayerSkeleton };
