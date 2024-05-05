import { AsideInfo } from "@/components/aside-info";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-7xl flex-1 gap-12 px-6 pb-8 lg:grid lg:grid-cols-12 xl:px-20">
      <main className="flex w-full flex-1 flex-col overflow-hidden md:w-[726px] lg:col-span-8">
        {children}
      </main>
      <aside className="hidden flex-col lg:col-span-4 lg:flex">
        <AsideInfo />
      </aside>
    </div>
  );
}
