import { db } from "@/server/db";
import { zawhna } from "@/server/db/schema";
import { desc } from "drizzle-orm";
import { QuestionDataTable } from "./components/question-data-table";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { DashboardHeader } from "./components/dashboard-header";

export default async function Page() {
  const data = await db.query.zawhna.findMany({
    with: {
      users: true,
    },
    orderBy: [desc(zawhna.createdAt)],
  });

  return (
    <>
      <DashboardHeader
        heading="Questions"
        description="Here's a list of all the user submitted questions"
      >
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          New post
        </Button>
      </DashboardHeader>

      <QuestionDataTable data={data} />
    </>
  );
}
