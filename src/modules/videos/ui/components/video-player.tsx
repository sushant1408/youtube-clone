"use client";

import MuxPlayer from "@mux/mux-player-react";

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
      poster={thumbnailUrl || "/placeholder.svg"}
      playerInitTime={0}
      autoPlay={autoPlay}
      thumbnailTime={0}
      className="w-full h-full object-contain"
      accentColor="#ff0000"
      onPlay={onPlay}
    />
  );
};

export { VideoPlayer };
