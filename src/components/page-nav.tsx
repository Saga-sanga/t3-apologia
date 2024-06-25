"use client";

import { cn } from "@/lib/utils";
import type { Session } from "next-auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button, buttonVariants } from "./ui/button";
import { ShieldIcon } from "lucide-react";

type PageNavProps = {
  user: Session["user"] | undefined;
  className?: string;
  onOpenChange?: (open: boolean) => void;
};

export function PageNav({ user, className, onOpenChange }: PageNavProps) {
  const path = usePathname();
  const router = useRouter();

  return (
    <div className={className}>
      <Button
        variant="ghost"
        onClick={() => {
          router.push("/");
          onOpenChange?.(false);
        }}
        className={cn(
          path === "/" && "text-primary hover:text-primary",
          "justify-start md:justify-center",
        )}
      >
        Home
      </Button>
      <SheetLink link="/explore" onOpenChange={onOpenChange}>
        Explore
      </SheetLink>
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
  onOpenChange?: (open: boolean) => void;
};

function SheetLink({ children, link, onOpenChange }: SheetLinkProps) {
  const path = usePathname();
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      onClick={() => {
        router.push(link);
        onOpenChange?.(false);
      }}
      className={cn(
        path.includes(link) && "text-primary hover:text-primary",
        "justify-start md:justify-center",
      )}
    >
      {children}
    </Button>
  );
}
