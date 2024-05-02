"use client";

import { SelectComment, SelectUser } from "@/server/db/schema";
import { format } from "date-fns";
import { Fragment, useState } from "react";
import { CommentEdit } from "./comment-edit";
import { CommentOptions } from "./comment-options";
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

type CommentCardProps = {
  comment: SelectComment & {
    author: SelectUser | null;
  };
  isCurrentUser: boolean;
};

export function CommentCard({ comment, isCurrentUser }: CommentCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <article className="flex w-full space-x-2" key={comment.id}>
      {isEditing ? (
        <CommentEdit
          comment={{
            postId: comment.postId ?? "",
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
            <CardFooter className="p-4 pt-0">
              <Button className="px-0" variant="link">
                Reply
              </Button>
            </CardFooter>
          </Card>
        </Fragment>
      )}
    </article>
  );
}
