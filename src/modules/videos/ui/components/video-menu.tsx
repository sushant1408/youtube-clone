import {
  ListPlusIcon,
  MoreVerticalIcon,
  ShareIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface VideoMenuProps {
  videoId: string;
  variant?: "ghost" | "secondary";
  onRemove?: () => void;
}

const VideoMenu = ({ videoId, onRemove, variant = "ghost" }: VideoMenuProps) => {
  const onShare = () => {
    const fullUrl = `${process.env.NEXT_PUBLIC_APP_URL}/videos/${videoId}`;

    navigator.clipboard.writeText(fullUrl).then(() => {
      toast.success("Link copied to clipboard");
    });
  };

  return (
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
        <DropdownMenuItem>
          <ListPlusIcon />
          Add to playlist
        </DropdownMenuItem>
        {onRemove && (
          <DropdownMenuItem>
            <Trash2Icon />
            Remove
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { VideoMenu };
