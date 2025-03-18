import {
  ListPlusIcon,
  MoreVerticalIcon,
  ShareIcon,
  TrashIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlaylistAddModal } from "@/modules/playlists/ui/components/playlist-add-modal";

interface VideoMenuProps {
  videoId: string;
  variant?: "ghost" | "secondary";
  onRemove?: () => void;
}

const VideoMenu = ({
  videoId,
  onRemove,
  variant = "ghost",
}: VideoMenuProps) => {
  const [openPlaylistAddModal, setOpenPlaylistAddModal] = useState(false);

  const onShare = () => {
    const fullUrl = `${process.env.NEXT_PUBLIC_APP_URL}/videos/${videoId}`;

    navigator.clipboard.writeText(fullUrl).then(() => {
      toast.success("Link copied to clipboard");
    });
  };

  return (
    <>
      <PlaylistAddModal
        onOpenChange={setOpenPlaylistAddModal}
        open={openPlaylistAddModal}
        videoId={videoId}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={variant} size="icon" className="rounded-full">
            <MoreVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuItem onClick={onShare}>
            <ShareIcon />
            Share
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenPlaylistAddModal(true)}>
            <ListPlusIcon />
            Add to playlist
          </DropdownMenuItem>
          {onRemove && (
            <DropdownMenuItem onClick={onRemove}>
              <TrashIcon />
              Remove
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export { VideoMenu };
