import { format } from "date-fns";
import { Button, buttonVariants } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { getCurrentUser } from "@/server/auth";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { CalendarDays, Pencil, UserRound } from "lucide-react";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";

type PageProps = {
  params: {
    username: string;
  };
};

export default async function Page({ params }: PageProps) {
  const user = await getCurrentUser();

  const userData = await db.query.users.findFirst({
    where: eq(users.username, params.username),
  });

  if (!userData) {
    return notFound();
  }
  return (
    <main className="mx-auto w-full max-w-screen-lg space-y-8 rounded-lg border px-16 py-12">
      <div className="flex pb-2">
        <UserAvatar
          className="h-36 w-36"
          user={{ image: userData.image, name: userData.name }}
        />
        <div className="my-6 flex flex-1 justify-between pl-10">
          <div className="space-y-2 pr-5">
            <h1 className="text-3xl font-semibold">{userData.name}</h1>
            <p className="text-lg font-light tracking-wide text-foreground/80">
              {userData.profession}
            </p>
          </div>
          {user?.id === userData.id && (
            <div>
              <Link
                href="/settings"
                className={cn(buttonVariants(), "px-5 text-base")}
              >
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-center space-x-10 rounded-lg border px-2 py-5 capitalize text-foreground/80">
        <span className="flex">
          <UserRound className="mr-2 h-5 w-5" />
          {userData.sex}
        </span>
        <span className="flex">
          <CalendarDays className="mr-2 h-5 w-5" />
          Born on {format(userData?.dob ?? "", "MMM dd, yyyy")}
        </span>
      </div>
      <div className="rounded-lg border px-10 py-5">
        <h3 className="text-xl font-bold">Recent Questions</h3>
      </div>
    </main>
  );
}
