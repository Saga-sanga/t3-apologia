import { PostCard } from "@/components/post-card";
import { DashboardShell } from "@/components/shell";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { posts } from "@/server/db/schema";
import { desc, eq } from "drizzle-orm";
import { InfinitePostCardList } from "@/components/infinite-post-card-list";

export default async function Home() {
  // const session = await getServerAuthSession();

  const postsData = await db.query.posts.findMany({
    columns: {
      id: true,
      title: true,
      description: true,
      image: true,
      createdAt: true,
    },
    where: eq(posts.state, "published"),
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
    <DashboardShell className="divide-y md:divide-y-0">
      {postsData.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      <InfinitePostCardList cursor={lastItem?.createdAt?.toISOString()} />
    </DashboardShell>
  );
}
