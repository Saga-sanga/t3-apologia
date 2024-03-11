import { PostCard } from "@/components/post-card";
import { DashboardShell } from "@/components/shell";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { posts } from "@/server/db/schema";
import { api } from "@/trpc/server";
import { desc, eq } from "drizzle-orm";

export default async function Home() {
  const session = await getServerAuthSession();

  const postsData = await db.query.posts.findMany({
    where: eq(posts.state, "published"),
    orderBy: [desc(posts.createdAt)],
    with: {
      category: true,
    },
  });

  return (
    <DashboardShell>
      {postsData.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </DashboardShell>
  );
}
