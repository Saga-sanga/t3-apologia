import { MainNav } from "@/components/main-nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type LayoutProps = {
  children?: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <header className="sticky top-0 z-40 border-b bg-background">
        <MainNav />
      </header>
      <div className="mx-auto flex lg:grid max-w-7xl flex-1 gap-12 px-6 lg:grid-cols-12 xl:px-20">
        <main className="flex w-full flex-1 flex-col overflow-hidden md:w-[726px] lg:col-span-8">
          {children}
        </main>
        <aside className="hidden flex-col lg:flex lg:col-span-4">
          {/* <DashboardNav items={dashboardConfig.sidebarNav} /> */}
        </aside>
      </div>
    </div>
  );
}
