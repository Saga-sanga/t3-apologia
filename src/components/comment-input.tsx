"use client";

import { api } from "@/trpc/react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Icons } from "./icons";
import { UserAvatar } from "./user-avatar";

type CommentInputProps = {
  user: {
    image: string;
    name: string;
  };
};

// TODO: add dialog to prompt login if user is not logged in
export function CommentInput({ user }: CommentInputProps) {
  const [comment, setComment] = useState("");

  const router = useRouter();
  const pathname = usePathname();
  const postId = pathname.split("/")[2];

  const commentMutation = api.comment.create.useMutation({
    onSuccess: () => {
      setComment("");
      router.refresh();
      toast.success("Comment created successfully");
    },
    onError: () =>
      toast.error("Cannot create comment", {
        description: "Please check your network and try again.",
      }),
  });

  const handleCreate = () => {
    if (postId) {
      commentMutation.mutate({
        postId,
        content: comment,
      });
    }
  };

  return (
    <div className="not-prose mt-12 border-t">
      <h3 className="mb-6 mt-10 text-2xl font-semibold" id="comments">
        Comments
      </h3>
      <div className="flex space-x-2">
        <UserAvatar user={{ name: user.name, image: user.image }} />
        <div className="w-full space-y-3">
          <Textarea
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            placeholder="Hetah hian I thil sawi duh te comment rawh le"
            rows={6}
          />
          <Button
            onClick={handleCreate}
            disabled={commentMutation.isLoading || !comment}
          >
            {commentMutation.isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
