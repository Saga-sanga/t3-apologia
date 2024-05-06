import { db } from "@/server/db";
import { comments } from "@/server/db/schema";
import { desc } from "drizzle-orm";
import { MessagesSquare } from "lucide-react";
import { Fragment } from "react";
import { CommentCard } from "./comment-card";
import { RepliesList } from "./replies-list";
import { getCurrentUser } from "@/server/auth";

type CommentListProps = {
  postId: string;
  userId: string | undefined;
};

export async function CommentList({ postId, userId }: CommentListProps) {
  const postComments = await db.query.comments.findMany({
    where: (comment, { eq }) => eq(comment.postId, postId),
    orderBy: desc(comments.createdAt),
    with: {
      author: {
        columns: {
          id: true,
          name: true,
          image: true,
        },
      },
      replies: {
        orderBy: (replies, { asc }) => [asc(replies.createdAt)],
        with: {
          author: {
            columns: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
    },
  });

  const user = await getCurrentUser();

  return (
    <div className="mx-auto space-y-8 px-4 md:max-w-3xl md:px-0">
      {postComments.length > 0 ? (
        postComments.map((comment) => (
          <div key={comment.id}>
            <CommentCard
              isAuth={!!user}
              comment={comment}
              isCurrentUser={userId === comment.author?.id}
            />
            <RepliesList
              parentId={comment.id}
              replies={comment.replies}
              isCurrentUser={userId === comment.author?.id}
            />
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center space-y-2 pb-14 pt-8 text-center">
          <span className="mb-1 rounded-full bg-accent p-3">
            <MessagesSquare className="h-5 w-5 text-muted-foreground" />
          </span>
          <p className="text-lg font-medium">No comments yet</p>
          <p className="font-light text-muted-foreground">
            Be the first to start the conversation.
          </p>
        </div>
      )}
    </div>
  );
}
