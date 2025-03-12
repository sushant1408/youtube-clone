import { type VariantProps } from "class-variance-authority";
import { ComponentProps } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SubscriptionButtonProps {
  onClick: ComponentProps<"button">["onClick"];
  disabled: boolean;
  isSubscribed: boolean;
  className?: string;
  size?: VariantProps<typeof buttonVariants>["size"];
}

const SubscriptionButton = ({
  disabled,
  isSubscribed,
  onClick,
  className,
  size,
}: SubscriptionButtonProps) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={cn("rounded-full", className)}
      size={size}
      variant={isSubscribed ? "secondary" : "default"}
    >
      {isSubscribed ? "Unsubscribe" : "Subscribe"}
    </Button>
  );
};

export { SubscriptionButton };
