import { DashboardShell } from "@/components/shell";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import Link from "next/link";

export default async function Home() {
  const session = await getServerAuthSession();
  const data = await api.post.hello.query({ text: "Sangs" });

  return (
    <DashboardShell>
      <h1>{data.greeting}</h1>
      {session && <p>Welcome {session.user.name}</p>}
    </DashboardShell>
  );
}
