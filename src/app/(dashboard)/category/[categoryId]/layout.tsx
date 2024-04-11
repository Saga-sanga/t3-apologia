import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/server/db";

export default async function CategoryLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    categoryId: string;
  };
}) {
  const category = await db.query.categories.findFirst({
    where: (categories, { eq }) => eq(categories.id, params.categoryId),
  });

  return (
    <div className="mx-auto flex max-w-7xl flex-1 gap-12 px-6 pb-8 lg:grid lg:grid-cols-12 xl:px-20">
      <main className="flex w-full flex-1 flex-col space-y-8 overflow-hidden md:w-[726px] lg:col-span-8">
        <Card>
          <CardHeader className="space-y-3 p-10 text-center">
            <CardTitle className="text-3xl font-bold tracking-wide">
              {category?.name}
            </CardTitle>
            <CardDescription className="text-pretty text-lg text-card-foreground/75">
              He category a kan chhanna neih zawng zawngte...
            </CardDescription>
          </CardHeader>
        </Card>
        {children}
      </main>
      <aside className="hidden flex-col lg:col-span-4 lg:flex">
        {/* <DashboardNav items={dashboardConfig.sidebarNav} /> */}
      </aside>
    </div>
  );
}
