"use client";

import { format } from "date-fns";
import { CommentOptions } from "./comment-options";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { UserAvatar } from "./user-avatar";
import { SelectComment, SelectUser } from "@/server/db/schema";
import { Fragment, useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { api } from "@/trpc/react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Icons } from "./icons";

type CommentCardProps = {
  comment: SelectComment & {
    author: SelectUser | null;
  };
  isCurrentUser: boolean;
};

export function CommentCard({ comment, isCurrentUser }: CommentCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [commentContent, setCommentContent] = useState(comment.content ?? "");

  const editComment = api.comment.update.useMutation();
  const router = useRouter();

  const handleEdit = () => {
    editComment.mutate(
      {
        postId: comment.postId ?? "",
        commentId: comment.id,
        content: commentContent,
      },
      {
        onSuccess: () => {
          router.refresh();
          setIsEditing(false);
        },
        onError: (error) => {
          console.log({ error });
          toast.error("Failed to update comment. Please try again!");
        },
      },
    );
  };

  return (
    <article className="flex w-full space-x-2" key={comment.id}>
      {isEditing ? (
        <div className="w-full space-y-2">
          <Textarea
            rows={5}
            className="resize-none"
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
          />
          <div className="flex justify-end space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={editComment.isLoading}
              onClick={handleEdit}
            >
              {editComment.isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save
            </Button>
          </div>
        </div>
      ) : (
        <Fragment>
          <UserAvatar
            user={{
              name: comment.author?.name ?? null,
              image: comment.author?.image ?? null,
            }}
          />
          <Card className="w-full">
            <CardHeader className="flex-row items-center justify-between space-y-0 p-4 pb-0">
              <div className="flex items-center space-x-3">
                <CardTitle className="text-md font-medium">
                  {comment.author?.name}
                </CardTitle>
                <span className="h-1 w-1 rounded-full bg-muted-foreground"></span>
                <CardDescription>
                  {format(comment.createdAt ?? "", "MMM dd, yyy")}
                </CardDescription>
              </div>
              <CommentOptions
                commentId={comment.id}
                isCurrentUser={isCurrentUser}
                setIsEditing={setIsEditing}
              />
            </CardHeader>
            <CardContent className="p-4 pt-2 text-foreground/80">
              <p>{comment.content}</p>
            </CardContent>
          </Card>
        </Fragment>
      )}
    </article>
  );
}
