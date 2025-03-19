import { useAuth } from "@clerk/nextjs";
import { Edit2Icon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { UserGetOneOutput } from "../../types";
import { BannerUploadModal } from "./banner-upload-modal";

interface UserPageBannerProps {
  user: UserGetOneOutput;
}

const UserPageBanner = ({ user }: UserPageBannerProps) => {
  const { userId } = useAuth();
  const [bannerUploadModalOpen, setBannerUploadModalOpen] = useState(false);

  return (
    <div className="relative group">
      <BannerUploadModal
        userId={user.id}
        onOpenChange={setBannerUploadModalOpen}
        open={bannerUploadModalOpen}
      />

      <div
        className={cn(
          "w-full max-h-[200px] h-[15vh] md:h-[25vh] bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl",
          user.bannerUrl ? "bg-cover bg-center" : "bg-gray-100"
        )}
        style={{
          backgroundImage: user.bannerUrl
            ? `url(${user.bannerUrl})`
            : undefined,
        }}
      />
      {user.clerkId === userId && (
        <Button
          type="button"
          size="icon"
          className="absolute top-4 right-4 rounded-full bg-black/50 hover:bg-black/50 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={() => setBannerUploadModalOpen(true)}
        >
          <Edit2Icon className="size-4 text-white" />
        </Button>
      )}
    </div>
  );
};

const UserPageBannerSkeleton = () => {
  return <Skeleton className="w-full max-h-[200px] h-[15vh] md:h-[25vh]" />;
};

export { UserPageBanner, UserPageBannerSkeleton };
