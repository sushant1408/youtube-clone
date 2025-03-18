"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";

import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/lib/constants";
import {
  VideoGridCard,
  VideoGridCardSkeleton,
} from "@/modules/videos/ui/components/video-grid-card";
import {
  VideoRowCard,
  VideoRowCardSkeleton,
} from "@/modules/videos/ui/components/video-row-card";
import { trpc } from "@/trpc/client";

interface CustomPlaylistVideosSectionProps {
  playlistId: string;
}

const CustomPlaylistVideosSection = ({
  playlistId,
}: CustomPlaylistVideosSectionProps) => {
  return (
    <Suspense fallback={<CustomPlaylistVideosSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <CustomPlaylistVideosSectionSuspense playlistId={playlistId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const CustomPlaylistVideosSectionSkeleton = () => {
  return (
    <>
      <div className="flex flex-col gap-4 gap-y-10 md:hidden">
        {Array.from({ length: 4 }).map((_, index) => (
          <VideoGridCardSkeleton key={index} />
        ))}
      </div>
      <div className="hidden flex-col gap-4 md:flex">
        {Array.from({ length: 4 }).map((_, index) => (
          <VideoRowCardSkeleton key={index} size="compact" />
        ))}
      </div>
    </>
  );
};

const CustomPlaylistVideosSectionSuspense = ({
  playlistId,
}: CustomPlaylistVideosSectionProps) => {
  const utils = trpc.useUtils();

  const [videos, query] = trpc.playlists.getManyCustom.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
      playlistId,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const removeFromPlaylist = trpc.playlists.removeVideo.useMutation({
    onSuccess: (data) => {
      toast.success("Video removed from playlist");

      utils.playlists.getMany.invalidate();
      utils.playlists.getManyForVideo.invalidate({ videoId: data.videoId });
      utils.playlists.getOne.invalidate({ id: data.playlistId });
      utils.playlists.getManyCustom.invalidate({ playlistId: data.playlistId });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <>
      <div className="flex flex-col gap-4 gap-y-10 md:hidden">
        {videos.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoGridCard
              key={video.id}
              data={video}
              onRemove={() =>
                removeFromPlaylist.mutate({ playlistId, videoId: video.id })
              }
            />
          ))}
      </div>
      <div className="hidden flex-col gap-4 md:flex">
        {videos.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoRowCard
              key={video.id}
              data={video}
              size="compact"
              onRemove={() =>
                removeFromPlaylist.mutate({ playlistId, videoId: video.id })
              }
            />
          ))}
      </div>
      <InfiniteScroll
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </>
  );
};

export { CustomPlaylistVideosSection };
