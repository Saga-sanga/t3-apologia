import { MainNav } from "@/components/main-nav";
import { getCurrentUser } from "@/server/auth";
import { redirect } from "next/navigation";

type LayoutProps = {
  children?: React.ReactNode;
};

export default async function Layout({ children }: LayoutProps) {
  const user = await getCurrentUser();

  if (user && !user?.completedOnboarding) {
    redirect("/welcome");
  }
  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <header className="sticky top-0 z-40 border-b bg-background">
        <MainNav />
      </header>
      {children}
    </div>
  );
}
