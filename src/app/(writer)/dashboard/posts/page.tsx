import { Button } from "@/components/ui/button";
import { DashboardHeader } from "../components/dashboard-header";
import { PlusIcon } from "lucide-react";
import { PostDataTable } from "../components/post-data-table";
import { db } from "@/server/db";

export default async function PostsPage() {
  const data = await db.query.posts.findMany();

  return (
    <>
      <DashboardHeader
        heading="Posts"
        description="Create and manage posts"
      >
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          New post
        </Button>
      </DashboardHeader>
      <PostDataTable data={data} />
    </>
  );
}
