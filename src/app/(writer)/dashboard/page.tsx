import { getCurrentUser } from "@/server/auth";
import { db } from "@/server/db";
import { redirect } from "next/navigation";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";

export default async function Page() {
  const currentUser = await getCurrentUser();

  if (currentUser?.role === "writer" || currentUser?.role !== "admin") {
    redirect("/");
  }

  const data = await db.query.zawhna.findMany({
    with: {
      users: true,
    },
  });

  console.log("Data: ", { data });

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Writer Dashboard
          </h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of all the user submitted questions
          </p>
        </div>
        <div className="flex items-center space-x-2">{/* <UserNav /> */}</div>
      </div>
      <DataTable columns={columns} data={data} />
    </>
  );
}
