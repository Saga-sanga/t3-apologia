"use client";

import { SelectComment, SelectReply, SelectUser } from "@/server/db/schema";
import { format } from "date-fns";
import { Fragment, useState } from "react";
import { CommentEditor } from "./comment-editor";
import { CommentOptions } from "./comment-options";
import { ReplyEditor } from "./reply-editor";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { UserAvatar } from "./user-avatar";
import { ReplyDialog } from "./reply-dialog";
import { useSession } from "next-auth/react";

type CommentCardProps = {
  comment: SelectComment & {
    author: Pick<SelectUser, "id" | "name" | "image"> | null;
    replies: SelectReply[];
  };
  isCurrentUser: boolean;
  isAuth: boolean;
};

export function CommentCard({
  comment,
  isCurrentUser,
  isAuth,
}: CommentCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isReply, setIsReply] = useState(false);

  return (
    <div className="space-y-4">
      <article className="flex w-full space-x-2" key={comment.id}>
        {isEditing ? (
          <CommentEditor
            postId={comment.postId ?? ""}
            comment={{
              id: comment.id,
              content: comment.content,
            }}
            setIsEditing={setIsEditing}
          />
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
                  variant="comment"
                  commentId={comment.id}
                  isCurrentUser={isCurrentUser}
                  setIsEditing={setIsEditing}
                />
              </CardHeader>
              <CardContent className="p-4 py-2 text-foreground/80 ">
                <div
                  className="prose "
                  dangerouslySetInnerHTML={{ __html: comment.content ?? "" }}
                />
              </CardContent>
              <CardFooter className="flex items-center space-x-2 p-4 pb-2 pt-0">
                {isAuth ? (
                  <Button
                    onClick={() => setIsReply(!isReply)}
                    className="px-0"
                    variant="link"
                  >
                    Reply
                  </Button>
                ) : (
                  <ReplyDialog />
                )}
                {comment.replies.length > 0 && (
                  <Fragment>
                    <span className="h-1 w-1 rounded-full bg-muted-foreground"></span>
                    <p className="text-sm text-muted-foreground">
                      {comment.replies.length} replies
                    </p>
                  </Fragment>
                )}
              </CardFooter>
            </Card>
          </Fragment>
        )}
      </article>
      {isReply && (
        <ReplyEditor parentId={comment.id} setIsEditing={setIsReply} />
      )}
    </div>
  );
}
