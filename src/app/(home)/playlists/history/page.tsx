import { DEFAULT_LIMIT } from "@/lib/constants";
import { HistoryView } from "@/modules/playlists/ui/views/history-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

export default async function HistoryPlaylistPage() {
  void trpc.playlists.getManyHistory.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <HistoryView />
    </HydrateClient>
  );
}
