"use client";

import { SelectReply, SelectUser } from "@/server/db/schema";
import { ReplyCard } from "./reply-card";
import { Button } from "./ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

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
  const [show, setShow] = useState(true);
  return (
    <div className="mx-auto max-w-3xl pl-12">
      {replies.length > 0 && (
        <Button className="mb-2" variant="link" onClick={() => setShow(!show)}>
          {!show ? (
            <span className="flex items-center">
              Show replies <ChevronDown className="ml-2 h-4 w-4" />
            </span>
          ) : (
            <span className="flex items-center">
              Hide replies <ChevronUp className="ml-2 h-4 w-4" />
            </span>
          )}
        </Button>
      )}
      <div className="space-y-8">
        {show &&
          replies.map((reply) => (
            <ReplyCard
              key={reply.id}
              isCurrentUser={isCurrentUser}
              parentId={parentId}
              reply={reply}
            />
          ))}
      </div>
    </div>
  );
}
