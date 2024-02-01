import { MainNav } from "@/components/main-nav";
import { DashboardNav } from "./dashboard/components/dashboard-nav";
import { getCurrentUser } from "@/server/auth";
import { redirect } from "next/navigation";

type LayoutProps = {
  children?: React.ReactNode;
};

export default async function WriterLayout({ children }: LayoutProps) {
  const currentUser = await getCurrentUser();

  if (currentUser?.role === "writer" || currentUser?.role !== "admin") {
    redirect("/");
  }
  return (
    <div className="flex min-h-screen flex-col space-y-8">
      <header className="sticky top-0 z-40 border-b bg-background">
        <MainNav />
      </header>
      <main className="container flex h-full flex-1 flex-col space-y-10 px-6 pb-8">
        <DashboardNav />
        {children}
      </main>
    </div>
  );
}
