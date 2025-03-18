import { DEFAULT_LIMIT } from "@/lib/constants";
import { CustomPlaylistView } from "@/modules/playlists/ui/views/custom-playlist-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

interface CustomPlaylistPageProps {
  params: Promise<{ playlistId: string }>;
}

export default async function CustomPlaylistPage({
  params,
}: CustomPlaylistPageProps) {
  const { playlistId } = await params;

  void trpc.playlists.getOne.prefetch({ id: playlistId });
  void trpc.playlists.getManyCustom.prefetchInfinite({
    limit: DEFAULT_LIMIT,
    playlistId,
  });

  return (
    <HydrateClient>
      <CustomPlaylistView playlistId={playlistId} />
    </HydrateClient>
  );
}
