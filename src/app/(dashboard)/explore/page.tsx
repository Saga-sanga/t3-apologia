import { Icons } from "@/components/icons";
import { db } from "@/server/db";
import { SelectCategory } from "@/server/db/schema";
import Link from "next/link";

function CategoryItem({ category }: { category: SelectCategory }) {
  return (
    <Link
      href={`/category/${category.id}`}
      className="flex items-center space-x-2 rounded-sm border border-transparent bg-primary/10 p-4 hover:border-primary"
    >
      <Icons.tag className="m-1 h-8 w-8 shrink-0 text-primary" />
      <div className="flex flex-col overflow-hidden">
        <h4 className="truncate font-bold">{category.name}</h4>
        <p className="text-sm text-muted-foreground">9 posts</p>
      </div>
    </Link>
  );
}

export default async function Page() {
  const categoriesData = await db.query.categories.findMany({
    orderBy: (categories, { desc }) => [desc(categories.name)],
  });

  return (
    <article className="space-y-6 rounded-lg border px-4 py-6">
      <div>
        <h3 className="text-xl font-bold">Categories</h3>
        <p className="text-muted-foreground">Kan category neih hrang hrangte</p>
      </div>
      <div className="flex flex-wrap">
        {categoriesData.map((category) => (
          <div className="w-1/2 p-2">
            <CategoryItem category={category} key={category.id} />
          </div>
        ))}
      </div>
    </article>
  );
}
