"use client";

import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { Skeleton } from "@/components/ui/skeleton";

interface PlaylistHeaderSectionProps {
  playlistId: string;
}

const PlaylistHeaderSection = ({ playlistId }: PlaylistHeaderSectionProps) => {
  return (
    <Suspense fallback={<PlaylistHeaderSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <PlaylistHeaderSectionSuspense playlistId={playlistId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const PlaylistHeaderSectionSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-4 w-32" />
    </div>
  );
};

const PlaylistHeaderSectionSuspense = ({
  playlistId,
}: PlaylistHeaderSectionProps) => {
  const utils = trpc.useUtils();
  const router = useRouter();

  const [playlist] = trpc.playlists.getOne.useSuspenseQuery({ id: playlistId });

  const remove = trpc.playlists.remove.useMutation({
    onSuccess: () => {
      toast.success("Playlist deleted");

      utils.playlists.getMany.invalidate();
      router.replace("/playlists");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">{playlist.name}</h1>
        <p className="text-xs text-muted-foreground">
          Videos from the playlist
        </p>
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() => remove.mutate({ id: playlistId })}
        disabled={remove.isPending}
        className="rounded-full"
      >
        <TrashIcon />
      </Button>
    </div>
  );
};

export { PlaylistHeaderSection };
