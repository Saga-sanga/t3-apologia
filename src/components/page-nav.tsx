"use client";

import { cn } from "@/lib/utils";
import type { Session } from "next-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "./ui/button";
import { ShieldIcon } from "lucide-react";

type PageNavProps = {
  user: Session["user"] | undefined;
};

export function PageNav({ user }: PageNavProps) {
  const path = usePathname();

  return (
    <div>
      {(user?.role === "writer" || user?.role === "admin") && (
        <Link
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "text-sm font-semibold",
            path === "/dashboard" && "text-primary hover:text-primary",
          )}
          href="/dashboard"
        >
          <ShieldIcon className="mr-1 h-4 w-4" />
          Dashboard
        </Link>
      )}
    </div>
  );
}
