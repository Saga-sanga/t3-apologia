import { Skeleton } from "./ui/skeleton";

export function CategorySkeleton() {
  return (
    <div className="space-y-2 py-1">
      <Skeleton className="h-8" />
      <Skeleton className="h-8" />
      <Skeleton className="h-8" />
      <Skeleton className="h-8" />
    </div>
  );
}
