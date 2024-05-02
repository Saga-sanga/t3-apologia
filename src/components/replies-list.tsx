"use client";

import { SelectReply, SelectUser } from "@/server/db/schema";
import { ReplyCard } from "./reply-card";

export type ReplyType = SelectReply & {
  author: Pick<SelectUser, "id" | "name" | "image"> | null;
};

type RepliesListProps = {
  isCurrentUser: boolean;
  parentId: string;
  replies: ReplyType[];
};

export function RepliesList({
  isCurrentUser,
  replies,
  parentId,
}: RepliesListProps) {

  return (
    <div className="mx-auto max-w-3xl space-y-8 pl-12">
      {replies.map((reply) => (
        <ReplyCard
          key={reply.id}
          isCurrentUser={isCurrentUser}
          parentId={parentId}
          reply={reply}
        />
      ))}
    </div>
  );
}
