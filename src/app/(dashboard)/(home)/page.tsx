import { PostCard } from "@/components/post-card";
import { DashboardShell } from "@/components/shell";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <DashboardShell>
      {session && <p>Welcome {session.user.name}</p>}
      <PostCard />
    </DashboardShell>
  );
}
