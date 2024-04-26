import { MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { api } from "@/trpc/react";
import { usePathname } from "next/navigation";
import { db } from "@/server/db";
import { desc } from "drizzle-orm";
import { comments } from "@/server/db/schema";
import { format } from "date-fns";
import { UserAvatar } from "./user-avatar";
import { CommentOptions } from "./comment-options";
import { CommentCard } from "./comment-card";
import { Fragment } from "react";

type CommentListProps = {
  postId: string;
  userId: string | undefined;
};

export async function CommentList({ postId, userId }: CommentListProps) {
  // const pathname = usePathname();
  // const postId = pathname.split("/")[2];
  // const comments = api.comment.get.useQuery({ postId: postId! });

  const postComments = await db.query.comments.findMany({
    where: (comment, { eq }) => eq(comment.postId, postId),
    orderBy: desc(comments.createdAt),
    with: {
      author: true,
      replies: true,
    },
  });

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {postComments.map((comment) => (
        <Fragment>
          <CommentCard
            comment={comment}
            isCurrentUser={userId === comment.author?.id}
          />
          {/* {JSON.stringify(comment.replies)} */}
        </Fragment>
      ))}
    </div>
  );
}
