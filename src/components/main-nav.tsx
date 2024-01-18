import Link from "next/link";
import { AskDialog } from "./ask-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { UserAccountNav } from "./user-account-nav";
import { getCurrentUser } from "@/server/auth";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

export async function MainNav() {
  const user = await getCurrentUser();

  return (
    <div className="container flex h-16 items-center justify-between py-4">
      <Link href="/">
        <p className="text-2xl font-bold">Mizo Apologia</p>
      </Link>
      <div className="flex items-center justify-center space-x-6">
        {user ? (
          <>
            <AskDialog />
            <UserAccountNav
              user={{
                name: user?.name || null,
                image: user?.image || null,
                email: user?.email || "",
              }}
            />
          </>
        ) : (
          <>
            <Link
              className={cn(buttonVariants({ variant: "outline" }))}
              href="/login"
            >
              Log in
            </Link>
            <Link
              className={cn(buttonVariants({ variant: "default" }))}
              href="register"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
