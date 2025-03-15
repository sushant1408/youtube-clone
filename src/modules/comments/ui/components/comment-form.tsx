import { useClerk, useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/user-avatar";
import { commentsInsertSchema } from "@/db/schema";
import { trpc } from "@/trpc/client";

interface CommentFormProps {
  videoId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  parentId?: string;
  variant?: "reply" | "comment";
}

const CommentForm = ({
  videoId,
  onCancel,
  onSuccess,
  parentId,
  variant = "comment",
}: CommentFormProps) => {
  const clerk = useClerk();
  const { user } = useUser();
  const utils = trpc.useUtils();

  const create = trpc.comments.create.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ videoId });
      utils.comments.getMany.invalidate({ videoId, parentId });
      form.reset();

      toast.success("Comment addded");

      onSuccess?.();
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      }

      toast.error("Something went wrong");
    },
  });

  const form = useForm<z.infer<typeof commentsInsertSchema>>({
    // @ts-expect-error expect error
    resolver: zodResolver(commentsInsertSchema.omit({ userId: true })),
    defaultValues: {
      parentId,
      videoId,
      value: "",
    },
  });

  const handleCancel = () => {
    form.reset();
    onCancel?.();
  };

  const onSubmit = (values: z.infer<typeof commentsInsertSchema>) => {
    create.mutate(values);
  };

  return (
    <Form {...form}>
      <form className="flex gap-4 group" onSubmit={form.handleSubmit(onSubmit)}>
        <UserAvatar
          size="lg"
          imageUrl={user?.imageUrl || ""}
          name={user?.fullName || "User"}
        />
        <div className="flex-1">
          <FormField
            name="value"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={
                      variant === "reply"
                        ? "Reply to this comment"
                        : "Add a comment"
                    }
                    className="resize-none bg-transparent overflow-hidden h-16 min-h-0"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="justify-end gap-2 mt-2 flex">
            {variant === "reply" && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                disabled={create.isPending}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              size="sm"
              disabled={create.isPending || !form.formState.isDirty}
            >
              {variant === "reply" ? "Reply" : "Comment"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export { CommentForm };
