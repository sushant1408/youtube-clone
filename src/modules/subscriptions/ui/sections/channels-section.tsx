"use client";

import Link from "next/link";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";

import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/lib/constants";
import { trpc } from "@/trpc/client";
import {
  SubscriptionItem,
  SubscriptionItemSkeleton,
} from "../components/subscription-item";

const ChannelsSection = () => {
  return (
    <Suspense fallback={<ChannelsSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <ChannelsSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const ChannelsSectionSkeleton = () => {
  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <SubscriptionItemSkeleton key={index} />
      ))}
    </>
  );
};

const ChannelsSectionSuspense = () => {
  const utils = trpc.useUtils();

  const [subscriptions, query] =
    trpc.subscriptions.getMany.useSuspenseInfiniteQuery(
      {
        limit: DEFAULT_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  const unsubscribe = trpc.subscriptions.remove.useMutation({
    onSuccess: (data) => {
      toast.success("Unsubscribed");
      utils.videos.getManySubscribed.invalidate();
      utils.users.getOne.invalidate({ id: data.creatorId });
      utils.subscriptions.getMany.invalidate();
    },
    onError: (error) => {
      toast.error("Something went wrong");
    },
  });

  return (
    <>
      <div className="flex flex-col gap-4">
        {subscriptions.pages
          .flatMap((page) => page.items)
          .map((subscription) => (
            <Link
              href={`/users/${subscription.user.id}`}
              key={`${subscription.creatorId}-${subscription.viewerId}`}
            >
              <SubscriptionItem
                name={subscription.user.name}
                imageUrl={subscription.user.imageUrl}
                subscriberCount={subscription.user.subscriberCount}
                onUnsubscribe={() =>
                  unsubscribe.mutate({ userId: subscription.creatorId })
                }
                disabled={unsubscribe.isPending}
              />
            </Link>
          ))}
      </div>
      <InfiniteScroll
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </>
  );
};

export { ChannelsSection };
