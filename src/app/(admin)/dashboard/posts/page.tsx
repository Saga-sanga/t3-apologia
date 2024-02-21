import { PostCreateButton } from "@/components/post-create-button";
import { db } from "@/server/db";
import { DashboardHeader } from "../components/dashboard-header";
import { PostDataTable } from "../components/post-data-table";
import { desc } from "drizzle-orm";
import { categories, posts } from "@/server/db/schema";
export const dynamic = "force-dynamic";

export default async function PostsPage() {
  const data = await db.query.posts.findMany({
    with: {
      category: true,
    },
    orderBy: [desc(posts.createdAt)],
  });

  const categoryList = await db.query.categories.findMany({
    orderBy: [desc(categories.name)],
  });

  return (
    <>
      <DashboardHeader heading="Posts" description="Create and manage posts">
        <PostCreateButton />
      </DashboardHeader>
      <PostDataTable data={data} categoryList={categoryList} />
    </>
  );
}
