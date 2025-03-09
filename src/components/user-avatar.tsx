import { cva, type VariantProps } from "class-variance-authority";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const userAvatarVariants = cva("", {
  variants: {
    size: {
      default: "h-9 w-9",
      xs: "h-4 w-4",
      sm: "h-6 w-6",
      lg: "h-10 w-10",
      xl: "h-[160px] w-[160px]",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface UserAvatarProps extends VariantProps<typeof userAvatarVariants> {
  imageUrl: string;
  name: string;
  className?: string;
  onClick?: () => void;
}

const UserAvatar = ({
  imageUrl,
  name,
  className,
  onClick,
  size,
}: UserAvatarProps) => {
  return (
    <Avatar
      className={cn(userAvatarVariants({ size, className }))}
      onClick={onClick}
    >
      <AvatarImage alt={name} src={imageUrl} />
      <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
};

export { UserAvatar };
