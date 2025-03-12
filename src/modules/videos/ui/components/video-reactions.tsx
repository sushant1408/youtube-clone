import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface VideoReactionsProps {}

const VideoReactions = ({}: VideoReactionsProps) => {
  return (
    <div className="flex items-center flex-none">
      <Button
        className="rounded-l-full rounded-r-none gap-2 pr-4"
        variant="secondary"
      >
        <ThumbsUpIcon className={cn("size-5", false && "fill-black")} />
        {1}
      </Button>
      <Separator orientation="vertical" className="h-7" />
      <Button
        className="rounded-r-full rounded-l-none pl-3"
        variant="secondary"
      >
        <ThumbsDownIcon className={cn("size-5", false && "fill-black")} />
        {1}
      </Button>
    </div>
  );
};

export { VideoReactions };
