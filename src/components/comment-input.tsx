"use client";

import { api } from "@/trpc/react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Icons } from "./icons";

// TODO: add dialog to prompt login if user is not logged in
export function CommentInput() {
  const [comment, setComment] = useState("");

  const pathname = usePathname();
  const postId = pathname.split("/")[2];

  const commentMutation = api.comment.create.useMutation({
    onSuccess: () => {
      setComment("");
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
    <div className="mt-12 border-t">
      <h3 className="pb-3">Comments</h3>
      <div className="flex space-x-2">
        <Avatar>
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
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
