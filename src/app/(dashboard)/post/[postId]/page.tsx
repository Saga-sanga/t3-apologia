import EditorTextParser from "@/components/editor-parser";
import { formatTimestamp } from "@/lib/utils";
import { getCurrentUser } from "@/server/auth";
import { db } from "@/server/db";
import { OutputData } from "@editorjs/editorjs";
import { CalendarDaysIcon } from "lucide-react";
import Image from "next/image";
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
    <main className="mx-auto w-full max-w-screen-xl">
      <div className="mb-14 grid grid-cols-8">
        <div className="col-span-full lg:col-span-6 lg:col-start-2">
          {post.image && (
            <div className="relative h-[38rem] w-full">
              <Image
                className="object-contain"
                src={post.image}
                fill={true}
                alt={post.title ?? "banner image"}
              />
            </div>
          )}
          <h1 className="mb-5 mt-6 break-words px-4 text-center text-3xl font-extrabold md:mt-10 md:px-5 md:text-4xl lg:px-8 xl:px-20 xl:text-5xl">
            {post.title}
          </h1>
          {post.createdAt && (
            <div className="flex items-center justify-center text-muted-foreground">
              <CalendarDaysIcon className="mr-3 h-5 w-5" />
              {formatTimestamp(post.createdAt)}
            </div>
          )}
        </div>
      </div>
      <div className="prose prose-lg xl:prose-xl prose-stone dark:prose-invert mx-auto w-full mb-20">
        <EditorTextParser data={post.content as OutputData} />
      </div>
    </main>
  );
}
