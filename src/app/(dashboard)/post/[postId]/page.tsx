import EditorTextParser from "@/components/editor-parser";
import { getCurrentUser } from "@/server/auth";
import { db } from "@/server/db";
import { OutputData } from "@editorjs/editorjs";
import { notFound } from "next/navigation";

type PostPageProps = {
  params: {
    postId: string;
  };
};

export default async function PostPage({ params }: PostPageProps) {
  const post = await db.query.posts.findFirst({
    where: (posts, { eq }) => eq(posts.id, params.postId),
  });

  const user = await getCurrentUser();

  if (!post || (post.state === "draft" && user?.role === "user")) {
    return notFound();
  }

  return (
    <div className="prose prose-lg xl:prose-xl prose-stone dark:prose-invert mx-auto w-full">
      <EditorTextParser data={post.content as OutputData} />
    </div>
  );
}
