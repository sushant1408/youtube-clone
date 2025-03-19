import { DEFAULT_LIMIT } from "@/lib/constants";
import { UserView } from "@/modules/users/ui/views/user-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

interface UserIdPageProps {
  params: Promise<{ userId: string }>;
}

export default async function UserIdPage({ params }: UserIdPageProps) {
  const { userId } = await params;

  void trpc.users.getOne.prefetch({ id: userId });
  void trpc.videos.getMany.prefetchInfinite({ limit: DEFAULT_LIMIT, userId });

  return (
    <HydrateClient>
      <UserView userId={userId} />
    </HydrateClient>
  );
}
