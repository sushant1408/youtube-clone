import { DEFAULT_LIMIT } from "@/lib/constants";
import { LikedView } from "@/modules/playlists/ui/views/liked-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

export default async function LikedPlaylistPage() {
  void trpc.playlists.getManyLiked.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <LikedView />
    </HydrateClient>
  );
}
