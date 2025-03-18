import { CustomPlaylistVideosSection } from "@/modules/playlists/ui/sections/custom-playlist-videos-section";
import { PlaylistHeaderSection } from "@/modules/playlists/ui/sections/playlist-header-section";

interface CustomPlaylistViewProps {
  playlistId: string;
}

const CustomPlaylistView = ({ playlistId }: CustomPlaylistViewProps) => {
  return (
    <div className="max-w-screen-md mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
      <PlaylistHeaderSection playlistId={playlistId} />
      <CustomPlaylistVideosSection playlistId={playlistId} />
    </div>
  );
};

export { CustomPlaylistView };
