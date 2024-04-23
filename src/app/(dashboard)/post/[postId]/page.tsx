import EditorTextParser from "@/components/editor-parser";
import { Icons } from "@/components/icons";
import { CommentInput } from "@/components/comment-input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatTimestamp } from "@/lib/utils";
import { getCurrentUser } from "@/server/auth";
import { db } from "@/server/db";
import { OutputData } from "@editorjs/editorjs";
import { CalendarDaysIcon, DotIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment } from "react";

type PostPageProps = {
  params: {
    postId: string;
  };
};

export default async function PostPage({ params }: PostPageProps) {
  const post = await db.query.posts.findFirst({
    where: (posts, { eq }) => eq(posts.id, params.postId),
    with: {
      category: true,
    },
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
            <div className="relative h-[380px] w-full md:h-[38rem]">
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
              <CalendarDaysIcon className="mr-2 h-5 w-5" />
              {formatTimestamp(post.createdAt)}
              {post.category && (
                <Fragment>
                  <DotIcon className="mx-3 h-4 w-4" />
                  <Link
                    href={`/category/${post.category.id}`}
                    className="flex items-center hover:text-primary"
                  >
                    <Icons.tag className="mr-2 h-5 w-5" />
                    {post?.category?.name}
                  </Link>
                </Fragment>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="prose prose-lg prose-stone mx-auto mb-20 w-full text-pretty px-4 dark:prose-invert xl:prose-xl">
        <EditorTextParser data={post.content as OutputData} />
        <CommentInput />
      </div>
    </main>
  );
}
