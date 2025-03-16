import Link from "next/link";

import { VideoThumbnail } from "./video-thumbnail";
import { VideoGetManyOutput } from "../../types";
import { VideoInfo } from "./video-info";

interface VideoRowCardProps {
  data: VideoGetManyOutput["items"][number];
  onRemove?: () => void;
}

const VideoGridCard = ({ data, onRemove }: VideoRowCardProps) => {
  return (
    <div className="flex flex-col gap-2 w-full group">
      <Link href={`/videos/${data.id}`}>
        <VideoThumbnail
          imageUrl={data.thumbnailUrl}
          previewUrl={data.previewUrl}
          title={data.title}
          duration={data.duration}
        />
      </Link>
      <VideoInfo data={data} onRemove={onRemove} />
    </div>
  );
};

const VideoGridCardSkeleton = () => {
  return <div></div>;
};

export { VideoGridCard, VideoGridCardSkeleton };
