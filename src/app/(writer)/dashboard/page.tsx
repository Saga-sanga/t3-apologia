import { getCurrentUser } from "@/server/auth";
import { db } from "@/server/db";
import { zawhna } from "@/server/db/schema";
import { desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { DataTable } from "./components/data-table";
import { questionColumns } from "./components/question-columns";

export default async function Page() {
  const currentUser = await getCurrentUser();

  if (currentUser?.role === "writer" || currentUser?.role !== "admin") {
    redirect("/");
  }

  const data = await db.query.zawhna.findMany({
    with: {
      users: true,
    },
    orderBy: [desc(zawhna.createdAt)],
  });

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Questions</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of all the user submitted questions
          </p>
        </div>
      </div>
      <DataTable columnFilterName="question" columns={questionColumns} data={data} />
    </>
  );
}
