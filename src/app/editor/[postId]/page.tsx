import { Editor } from "@/components/editor";
import { authOptions, getCurrentUser } from "@/server/auth";
import { db } from "@/server/db";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// TODO: Fix caching
interface EditorPageProps {
  params: {
    postId: string;
  };
}

export default async function EditorPage({ params }: EditorPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(authOptions.pages?.signIn ?? "/login");
  }

  const post = await db.query.posts.findFirst({
    where: (posts, { eq }) => eq(posts.id, params.postId),
  });

  if (!post) {
    notFound();
  }

  return (
    <Editor
      post={{
        id: post.id,
        title: post.title,
        content: post.content,
        state: post.state,
        image: post.image,
        categoryId: post.categoryId,
        questionId: post.questionId,
        description: post.description,
      }}
    />
  );
}
