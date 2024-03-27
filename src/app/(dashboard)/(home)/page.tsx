import { PostCard } from "@/components/post-card";
import { DashboardShell } from "@/components/shell";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { posts } from "@/server/db/schema";
import { desc, eq } from "drizzle-orm";
import { InfinitePostCardList } from "./components/infinite-post-card-list";

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
    limit: 2,
  });

  const lastItem = postsData.length >= 2 ? postsData[postsData.length - 1] : undefined;

  return (
    <DashboardShell>
      {postsData.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      <InfinitePostCardList cursor={lastItem?.createdAt?.toISOString()} />
    </DashboardShell>
  );
}
