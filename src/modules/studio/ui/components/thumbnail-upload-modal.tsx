import { ResponsiveModal } from "@/components/responsive-modal";
import { UploadDropzone } from "@/lib/uploadthing";
import { trpc } from "@/trpc/client";

interface ThumbnailUploadModalProps {
  videoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ThumbnailUploadModal = ({
  onOpenChange,
  open,
  videoId,
}: ThumbnailUploadModalProps) => {
  const utils = trpc.useUtils();

  const onUploadComplete = () => {
    utils.studio.getMany.invalidate();
    utils.studio.getOne.invalidate({ id: videoId });

    onOpenChange(false);
  };

  return (
    <ResponsiveModal
      title="Upload a thumbnail"
      open={open}
      onOpenChange={onOpenChange}
    >
      <UploadDropzone
        endpoint="thumbnailUploader"
        input={{ videoId }}
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

export { ThumbnailUploadModal };
