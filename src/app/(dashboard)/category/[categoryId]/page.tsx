import { db } from "@/server/db";
import { posts } from "@/server/db/schema";
import { and, desc, eq } from "drizzle-orm";

import { InfinitePostCardList } from "@/components/infinite-post-card-list";
import { PostCard } from "@/components/post-card";
import { DashboardShell } from "@/components/shell";

type CategoryPageProps = {
  params: {
    categoryId: string;
  };
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const postsData = await db.query.posts.findMany({
    columns: {
      id: true,
      title: true,
      description: true,
      image: true,
      createdAt: true,
    },
    where: and(
      eq(posts.state, "published"),
      eq(posts.categoryId, params.categoryId),
    ),
    orderBy: [desc(posts.createdAt)],
    with: {
      category: true,
    },
    limit: 3,
  });

  // Take the last item of the array to use it's date as the next cursor.
  // Return only if the posts is a certain length so as to ensure that additional data exists.
  const lastItem =
    postsData.length >= 3 ? postsData[postsData.length - 1] : undefined;

  return (
    <DashboardShell>
      {postsData.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      <InfinitePostCardList
        cursor={lastItem?.createdAt?.toISOString()}
        categoryId={params.categoryId}
      />
    </DashboardShell>
  );
}
