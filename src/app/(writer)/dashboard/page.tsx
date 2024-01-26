import { PostCreateButton } from "@/components/post-create-button";
import { db } from "@/server/db";
import { zawhna } from "@/server/db/schema";
import { desc } from "drizzle-orm";
import { DashboardHeader } from "./components/dashboard-header";
import { QuestionDataTable } from "./components/question-data-table";

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
        <PostCreateButton />
      </DashboardHeader>

      <QuestionDataTable data={data} />
    </>
  );
}
