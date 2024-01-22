"use client";

import { usePathname } from "next/navigation";
import { AskDialog } from "./ask-dialog";
import { PencilLineIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

interface NavButtonsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function NavButtons({ children }: NavButtonsProps) {
  const path = usePathname();

  return (
    <>
      {path.includes("/dashboard") ? (
        <Link href="#" className={cn(buttonVariants())}>
          <PencilLineIcon className="mr-2 h-4 w-4" /> Write
        </Link>
      ) : (
        <AskDialog />
      )}
      {children}
    </>
  );
}
