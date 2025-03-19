import { UserAvatar } from "@/components/user-avatar";
import { SubscriptionButton } from "./subscription-button";
import { Skeleton } from "@/components/ui/skeleton";

interface SubscriptionItemProps {
  name: string;
  imageUrl: string;
  subscriberCount: number;
  onUnsubscribe: () => void;
  disabled: boolean;
}

const SubscriptionItem = ({
  disabled,
  imageUrl,
  name,
  onUnsubscribe,
  subscriberCount,
}: SubscriptionItemProps) => {
  return (
    <div className="flex items-center gap-4">
      <UserAvatar
        imageUrl={imageUrl}
        name={name}
        size="lg"
        className="size-10 md:size-[136px]"
      />

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl">{name}</h3>
            <p className="text-xs text-muted-foreground">
              {subscriberCount.toLocaleString()} subscribers
            </p>
          </div>

          <SubscriptionButton
            disabled={disabled}
            onClick={(e) => {
              e.preventDefault();
              onUnsubscribe();
            }}
            isSubscribed
          />
        </div>
      </div>
    </div>
  );
};

const SubscriptionItemSkeleton = () => {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="rounded-full size-10 md:size-[136px]" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-1 h-3 w-20" />
          </div>

          <Skeleton className="h-10 w-30 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export { SubscriptionItem, SubscriptionItemSkeleton };
