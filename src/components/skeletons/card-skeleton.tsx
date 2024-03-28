import { Skeleton } from "../ui/skeleton";

export function CardSkeletion() {
  return (
    <div className="animate-pulse space-y-5 rounded-lg border p-6">
      <Skeleton className="h-3 w-20" />
      <div className="flex justify-between gap-3 sm:gap-4 md:gap-6">
        <div className="w-full space-y-5">
          <div className="space-y-2">
            <Skeleton className="h-5" />
            <Skeleton className="h-5" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3" />
            <Skeleton className="h-3" />
            <Skeleton className="h-3" />
          </div>
        </div>
        <Skeleton className="md:h-[108px] md:shrink-0 md:basis-[180px]" />
      </div>
      <div className="flex justify-between">
        <div className="flex space-x-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}
