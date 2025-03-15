import { CornerDownRightIcon, Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DEFAULT_LIMIT } from "@/lib/constants";
import { trpc } from "@/trpc/client";
import { CommentGetManyOutput } from "../../types";
import { CommentItem } from "./comment-item";

interface CommentRepliesProps {
  parentId: CommentGetManyOutput["items"][number]["id"];
  videoId: CommentGetManyOutput["items"][number]["videoId"];
}

const CommentReplies = ({ parentId, videoId }: CommentRepliesProps) => {
  const { data, hasNextPage, isFetchingNextPage, isLoading, fetchNextPage } =
    trpc.comments.getMany.useInfiniteQuery(
      {
        limit: DEFAULT_LIMIT,
        videoId,
        parentId,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  return (
    <div className="pl-14">
      <div className="flex flex-col gap-4 mt-2">
        {isLoading && (
          <div className="flex items-center justify-center">
            <Loader2Icon className="animate-spin size-6 text-muted-foreground" />
          </div>
        )}
        {!isLoading &&
          data?.pages
            .flatMap((page) => page.items)
            .map((comment) => (
              <CommentItem key={comment.id} comment={comment} variant="reply" />
            ))}
      </div>

      {hasNextPage && (
        <Button
          variant="tertiary"
          size="sm"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          <CornerDownRightIcon />
          Show more replies
        </Button>
      )}
    </div>
  );
};

export { CommentReplies };
