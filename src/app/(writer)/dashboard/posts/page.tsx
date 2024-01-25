import { Button } from "@/components/ui/button";
import { DashboardHeader } from "../components/dashboard-header";
import { PlusIcon } from "lucide-react";

export default function PostsPage() {
  return (
    <>
      <DashboardHeader
        heading="Posts"
        description="Here's a list of all the posts created"
      >
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          New post
        </Button>
      </DashboardHeader>
      {/* <DataTable columns={columns} data={data} /> */}
    </>
  );
}
