import { MainNav } from "@/components/main-nav";

type LayoutProps = {
  children?: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <header className="sticky top-0 z-40 border-b bg-background">
        <MainNav />
      </header>
      {children}
    </div>
  );
}
