import { MainNav } from "@/components/main-nav";
import { DashboardNav } from "./dashboard/components/dashboard-nav";

type LayoutProps = {
  children?: React.ReactNode;
};

export default function WriterLayout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col space-y-8">
      <header className="sticky top-0 z-40 border-b bg-background">
        <MainNav />
      </header>
      <main className="container flex h-full flex-1 flex-col space-y-8 px-6 pb-8">
        <DashboardNav />
        {children}
      </main>
    </div>
  );
}
