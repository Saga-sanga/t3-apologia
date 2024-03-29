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
  const active = "text-primary hover:text-primary";

  return (
    <div className="flex items-center space-x-2 text-sm font-semibold">
      <Link
        className={cn(
          buttonVariants({ variant: "ghost" }),
          path === "/" && active,
        )}
        href="/"
      >
        Home
      </Link>
      <Link
        className={cn(
          buttonVariants({ variant: "ghost" }),
          path === "/explore" && active,
        )}
        href="/explore"
      >
        Explore
      </Link>
      {(user?.role === "writer" || user?.role === "admin") && (
        <Link
          className={cn(
            buttonVariants({ variant: "ghost" }),
            path.includes("/dashboard") && active,
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
