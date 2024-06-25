"use client";

import { cn } from "@/lib/utils";
import type { Session } from "next-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "./ui/button";
import { ShieldIcon } from "lucide-react";

type PageNavProps = {
  user: Session["user"] | undefined;
  className?: string;
};

export function PageNav({ user, className }: PageNavProps) {
  return (
    <div className={className}>
      <SheetLink link="/">Home</SheetLink>
      <SheetLink link="/explore">Explore</SheetLink>
      {(user?.role === "writer" || user?.role === "admin") && (
        <SheetLink link="/dashboard">
          <ShieldIcon className="mr-1 h-4 w-4" />
          Dashboard
        </SheetLink>
      )}
    </div>
  );
}

type SheetLinkProps = {
  children: React.ReactNode;
  link: string;
};

function SheetLink({ children, link }: SheetLinkProps) {
  const path = usePathname();
  const active = "text-primary hover:text-primary";

  return (
    <Link
      className={cn(
        buttonVariants({ variant: "ghost" }),
        path.includes(link) && active,
        "justify-start md:justify-center",
      )}
      href={link}
    >
      {children}
    </Link>
  );
}
