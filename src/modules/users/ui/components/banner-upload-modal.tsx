import { ResponsiveModal } from "@/components/responsive-modal";
import { UploadDropzone } from "@/lib/uploadthing";
import { trpc } from "@/trpc/client";

interface BannerUploadModalProps {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BannerUploadModal = ({
  onOpenChange,
  open,
  userId,
}: BannerUploadModalProps) => {
  const utils = trpc.useUtils();

  const onUploadComplete = () => {
    utils.users.getOne.invalidate({ id: userId });

    onOpenChange(false);
  };

  return (
    <ResponsiveModal
      title="Upload a banner"
      open={open}
      onOpenChange={onOpenChange}
    >
      <UploadDropzone
        endpoint="bannerUploader"
        appearance={{
          container: "py-6",
          uploadIcon: "text-muted-foreground",
          button: "bg-primary text-primary-foreground",
        }}
        onClientUploadComplete={onUploadComplete}
      />
    </ResponsiveModal>
  );
};

export { BannerUploadModal };
