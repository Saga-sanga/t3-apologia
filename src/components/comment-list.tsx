import { db } from "@/server/db";
import { comments } from "@/server/db/schema";
import { desc } from "drizzle-orm";
import { CommentCard } from "./comment-card";

type CommentListProps = {
  postId: string;
  userId: string | undefined;
};

export async function CommentList({ postId, userId }: CommentListProps) {
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
        <CommentCard
          key={comment.id}
          comment={comment}
          isCurrentUser={userId === comment.author?.id}
        />
      ))}
    </div>
  );
}
