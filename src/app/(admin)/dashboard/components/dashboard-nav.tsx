"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function DashboardNav() {
  const path = usePathname();

  return (
    <div className="flex items-center justify-center space-x-2 -mb-6">
      <Link
        className={cn(
          buttonVariants({ variant: "ghost" }),
          path === "/dashboard" && "bg-accent text-primary hover:text-primary",
        )}
        href="/dashboard"
      >
        Questions
      </Link>
      <Link
        className={cn(
          buttonVariants({ variant: "ghost" }),
          path === "/dashboard/posts" &&
            "bg-accent text-primary hover:text-primary",
        )}
        href="/dashboard/posts"
      >
        Posts
      </Link>
    </div>
  );
}
