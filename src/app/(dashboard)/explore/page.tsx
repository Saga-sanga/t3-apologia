import { Icons } from "@/components/icons";
import { db } from "@/server/db";
import { categories, posts, SelectCategory } from "@/server/db/schema";
import { count, desc, eq } from "drizzle-orm";
import Link from "next/link";

type CategoryItemProps = {
  category: SelectCategory & { count: number };
};

function CategoryItem({ category }: CategoryItemProps) {
  return (
    <Link
      href={`/category/${category.id}`}
      className="flex items-center space-x-2 rounded-sm border border-transparent bg-primary/10 p-4 hover:border-primary"
    >
      <Icons.tag className="m-1 h-8 w-8 shrink-0 text-primary" />
      <div className="flex flex-col overflow-hidden">
        <h4 className="truncate font-bold">{category.name}</h4>
        <p className="text-sm text-muted-foreground">{category.count} posts</p>
      </div>
    </Link>
  );
}

export default async function Page() {
  const categoriesWithCount = await db
    .select({
      id: categories.id,
      name: categories.name,
      count: count(posts.categoryId),
    })
    .from(categories)
    .leftJoin(posts, eq(categories.id, posts.categoryId))
    .where(eq(posts.state, "published"))
    .groupBy(categories.id)
    .orderBy(desc(categories.name));

  console.log({ categoriesWithCount });

  return (
    <article className="space-y-6 rounded-lg border px-4 py-6">
      <div>
        <h3 className="text-xl font-bold">Categories</h3>
        <p className="text-muted-foreground">Kan category neih hrang hrangte</p>
      </div>
      <div className="flex flex-wrap">
        {categoriesWithCount.map((category) => (
          <div className="w-1/2 p-2" key={category.id}>
            <CategoryItem category={category} />
          </div>
        ))}
      </div>
    </article>
  );
}
