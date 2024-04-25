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
    },
  });

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {postComments.map((comment) => (
        <article className="flex w-full space-x-2" key={comment.id}>
          <UserAvatar
            user={{
              name: comment.author?.name ?? null,
              image: comment.author?.image ?? null,
            }}
          />
          <Card className="w-full">
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
              <div className="flex items-center space-x-3">
                <CardTitle className="text-md font-medium">
                  {comment.author?.name}
                </CardTitle>
                <span className="h-1 w-1 rounded-full bg-muted-foreground"></span>
                <CardDescription>
                  {format(comment.createdAt ?? "", "MMM dd, yyy")}
                </CardDescription>
              </div>
              <CommentOptions isCurrentUser={userId === comment.author?.id} />
            </CardHeader>
            <CardContent className="text-foreground/80">
              <p>{comment.content}</p>
            </CardContent>
          </Card>
        </article>
      ))}
    </div>
  );
}
