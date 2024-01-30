import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { ChevronLeft } from "lucide-react";

type EditorNavProps = {
  state: "draft" | "published";
};

export function EditorNav({ state }: EditorNavProps) {
  return (
    <div className="flex items-center space-x-10">
      <Link
        href="/dashboard/posts"
        className={cn(buttonVariants({ variant: "ghost" }))}
      >
        <>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </>
      </Link>
      <p className="text-sm capitalize text-muted-foreground">{state}</p>
    </div>
  );
}
