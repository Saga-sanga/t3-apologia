import EditorTextParser from "@/components/editor-parser";
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

  if (!post) {
    return notFound();
  }

  return (
    <div className="prose prose-lg xl:prose-xl prose-stone dark:prose-invert mx-auto">
      <EditorTextParser data={post.content as OutputData} />
    </div>
  );
}
