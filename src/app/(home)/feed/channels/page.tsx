import { DEFAULT_LIMIT } from "@/lib/constants";
import { ChannelsView } from "@/modules/subscriptions/ui/views/channels-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

export default async function ChannelsPage() {
  void trpc.subscriptions.getMany.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <ChannelsView />
    </HydrateClient>
  );
}
