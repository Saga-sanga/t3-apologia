import { cn } from "@/lib/utils";
import { getCurrentUser } from "@/server/auth";
import { FeatherIcon } from "lucide-react";
import Link from "next/link";
import { NavButtons } from "./nav-buttons";
import { PageNav } from "./page-nav";
import { buttonVariants } from "./ui/button";
import { UserAccountNav } from "./user-account-nav";

export async function MainNav() {
  const user = await getCurrentUser();

  return (
    <div className="container flex h-16 items-center justify-between py-4">
      <Link href="/">
        <p className="flex items-center text-2xl font-bold">
          <FeatherIcon className="mr-2 h-8 w-8" />{" "}
          <span className="hidden md:block">Mizo Apologia</span>
        </p>
      </Link>
      <PageNav user={user} />
      <div className="flex items-center justify-center space-x-6">
        {user ? (
          <NavButtons>
            <UserAccountNav
              user={{
                name: user?.name ?? null,
                image: user?.image ?? null,
                email: user?.email ?? "",
              }}
            />
          </NavButtons>
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
