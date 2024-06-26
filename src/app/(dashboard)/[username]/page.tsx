import { format, formatDistanceToNowStrict } from "date-fns";
import { buttonVariants } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { getCurrentUser } from "@/server/auth";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { CalendarDays, Clock, Pencil, UserRound } from "lucide-react";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { UserQuestions } from "@/components/user-questions";

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
    <main className="mx-auto w-full max-w-screen-lg space-y-8 rounded-lg px-6 py-12 sm:px-16 lg:border">
      <div className="flex flex-col pb-2 sm:flex-row">
        <UserAvatar
          className="h-36 w-36"
          user={{ image: userData.image, name: userData.name }}
        />
        <div className="my-6 flex flex-1 flex-col justify-between gap-5 sm:pl-10 md:flex-row">
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
      <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border px-2 py-5 text-foreground/80 sm:flex-row sm:space-x-10 sm:space-y-0">
        <span className="flex capitalize">
          <UserRound className="mr-2 h-5 w-5" />
          {userData.sex}
        </span>
        <span className="flex">
          <Clock className="mr-2 h-5 w-5" />
          {formatDistanceToNowStrict(userData?.dob ?? "")} old
        </span>
        <span className="flex">
          <CalendarDays className="mr-2 h-5 w-5" />
          Member since {format(userData?.createdAt ?? "", "MMM, yyyy")}
        </span>
      </div>
      {user?.id === userData.id && (
        <UserQuestions userId={user?.id ?? userData.id} />
      )}
    </main>
  );
}
