"use client";

import { format } from "date-fns";
import { Fragment, useState } from "react";
import { CommentOptions } from "./comment-options";
import { ReplyType } from "./replies-list";
import { ReplyEditor } from "./reply-editor";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { UserAvatar } from "./user-avatar";

type CommentCardProps = {
  parentId: string;
  reply: ReplyType;
  isCurrentUser: boolean;
};

export function ReplyCard({
  reply,
  isCurrentUser,
  parentId,
}: CommentCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  // const [isReply, setIsReply] = useState(false);

  return (
    <div className="space-y-4">
      <article className="flex w-full space-x-2" key={reply.id}>
        {isEditing ? (
          <ReplyEditor
            parentId={parentId}
            reply={{ id: reply.id ?? "", content: reply.content ?? "" }}
            setIsEditing={setIsEditing}
          />
        ) : (
          <Fragment>
            <UserAvatar
              user={{
                name: reply.author?.name ?? null,
                image: reply.author?.image ?? null,
              }}
            />
            <Card className="w-full">
              <CardHeader className="flex-row items-center justify-between space-y-0 p-4 pb-0">
                <div className="flex items-center space-x-3">
                  <CardTitle className="text-md font-medium">
                    {reply.author?.name}
                  </CardTitle>
                  <span className="h-1 w-1 rounded-full bg-muted-foreground"></span>
                  <CardDescription>
                    {format(reply.createdAt ?? "", "MMM dd, yyy")}
                  </CardDescription>
                </div>
                <CommentOptions
                  variant="reply"
                  commentId={reply.id ?? ""}
                  isCurrentUser={isCurrentUser}
                  setIsEditing={setIsEditing}
                />
              </CardHeader>
              <CardContent className="p-4 pt-0 text-foreground/80 ">
                <div
                  className="prose "
                  dangerouslySetInnerHTML={{ __html: reply.content ?? "" }}
                />
              </CardContent>
            </Card>
          </Fragment>
        )}
      </article>
      {/* {isReply && (
        <ReplyEditor parentId={comment.id} setIsEditing={setIsReply} />
      )} */}
    </div>
  );
}
