"use client";

import { api } from "@/trpc/react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
  const ref = useRef<HTMLTextAreaElement>(null);

  const router = useRouter();
  const pathname = usePathname();
  const postId = pathname.split("/")[2];

  useEffect(() => {
    if (window.location.hash === "#comments" && ref.current) {
      ref.current.focus();
      console.log("commentss");
    }
  }, []);

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
    <div className="not-prose mt-20 border-t" id="comments">
      <h3 className="mb-10 mt-14 text-2xl font-semibold text-foreground">
        Comments
      </h3>
      <div className="flex space-x-2">
        <UserAvatar user={{ name: user.name, image: user.image }} />
        <div className="w-full space-y-3">
          <Textarea
            className="resize-none"
            ref={ref}
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
