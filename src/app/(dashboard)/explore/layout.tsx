import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-7xl flex-1 gap-12 px-6 pb-8 lg:grid lg:grid-cols-10 xl:w-full xl:max-w-full xl:px-32">
      <main className="flex w-full flex-1 flex-col space-y-6 overflow-hidden md:w-[726px] lg:col-start-2 lg:col-span-7 lg:w-full">
        <Card>
          <CardHeader className="space-y-3 p-10 text-center">
            <CardTitle className="text-3xl font-bold tracking-wide">
              Explore Our Categories
            </CardTitle>
            <CardDescription className="text-pretty text-lg text-card-foreground/75">
              Mizo Apologia a kan chhanna hrang hrangte olsam takin hetah hian i
              zawng thei e. Kan chhanna leh category te hi regular taka update
              ani.
            </CardDescription>
          </CardHeader>
        </Card>
        {children}
      </main>
      <aside className="hidden flex-col lg:col-span-3 lg:flex">
        {/* <DashboardNav items={dashboardConfig.sidebarNav} /> */}
      </aside>
    </div>
  );
}
