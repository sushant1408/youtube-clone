import { Loader2Icon, SquareCheckIcon, SquareIcon } from "lucide-react";

import { InfiniteScroll } from "@/components/infinite-scroll";
import { ResponsiveModal } from "@/components/responsive-modal";
import { Button } from "@/components/ui/button";
import { DEFAULT_LIMIT } from "@/lib/constants";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";

interface PlaylistAddModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoId: string;
}

const PlaylistAddModal = ({
  onOpenChange,
  open,
  videoId,
}: PlaylistAddModalProps) => {
  const utils = trpc.useUtils();

  const { data, hasNextPage, isFetchingNextPage, isLoading, fetchNextPage } =
    trpc.playlists.getManyForVideo.useInfiniteQuery(
      {
        limit: DEFAULT_LIMIT,
        videoId,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        enabled: open && !!videoId,
      }
    );
  const addToPlaylist = trpc.playlists.addVideo.useMutation({
    onSuccess: (data) => {
      toast.success("Video added to playlist");
      utils.playlists.getMany.invalidate();
      utils.playlists.getManyForVideo.invalidate({ videoId });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const removeFromPlaylist = trpc.playlists.removeVideo.useMutation({
    onSuccess: (data) => {
      toast.success("Video removed from playlist");
      utils.playlists.getMany.invalidate();
      utils.playlists.getManyForVideo.invalidate({ videoId });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <ResponsiveModal
      title="Add to playlist"
      open={open}
      onOpenChange={onOpenChange}
    >
      <div className="flex flex-col gap-2">
        {isLoading && (
          <div className="flex justify-center p-4">
            <Loader2Icon className="animate-spin size-5 text-muted-foreground" />
          </div>
        )}
        {!isLoading &&
          data?.pages
            .flatMap((page) => page.items)
            .map((playlist) => (
              <Button
                key={playlist.id}
                variant="ghost"
                className="w-full justify-start px-2"
                size="lg"
                onClick={() => {
                  if (playlist.containsVideo) {
                    removeFromPlaylist.mutate({
                      playlistId: playlist.id,
                      videoId,
                    });
                  } else {
                    addToPlaylist.mutate({
                      playlistId: playlist.id,
                      videoId,
                    });
                  }
                }}
                disabled={
                  addToPlaylist.isPending || removeFromPlaylist.isPending
                }
              >
                {playlist.containsVideo ? <SquareCheckIcon /> : <SquareIcon />}
                {playlist.name}
              </Button>
            ))}

        {!isLoading && (
          <InfiniteScroll
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
            isManual
          />
        )}
      </div>
    </ResponsiveModal>
  );
};

export { PlaylistAddModal };
