import { MainNav } from "@/components/main-nav";

type LayoutProps = {
  children?: React.ReactNode;
};

export default function WriterLayout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <header className="sticky top-0 z-40 border-b bg-background">
        <MainNav />
      </header>
      <main className="container flex h-full flex-1 flex-col px-6">{children}</main>
    </div>
  );
}
