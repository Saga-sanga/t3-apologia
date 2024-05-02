import { db } from "@/server/db";
import { comments } from "@/server/db/schema";
import { desc } from "drizzle-orm";
import { CommentCard } from "./comment-card";
import { Fragment } from "react";
import { RepliesList } from "./replies-list";
import { MessageCircleDashed, MessagesSquare } from "lucide-react";

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

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {postComments.length > 0 ? (
        postComments.map((comment) => (
          <Fragment key={comment.id}>
            <CommentCard
              comment={comment}
              isCurrentUser={userId === comment.author?.id}
            />
            <RepliesList
              parentId={comment.id}
              replies={comment.replies}
              isCurrentUser={userId === comment.author?.id}
            />
          </Fragment>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center space-y-2 py-8 text-center">
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
