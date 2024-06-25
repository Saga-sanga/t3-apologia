import { cn } from "@/lib/utils";
import { getCurrentUser } from "@/server/auth";
import { FeatherIcon } from "lucide-react";
import Link from "next/link";
import { AskDialog } from "./ask-dialog";
import { PageNav } from "./page-nav";
import { buttonVariants } from "./ui/button";
import { UserAccountNav } from "./user-account-nav";
import { OramaSearchBox } from "./orama-search-box";
import { SearchButton } from "@orama/searchbox";
import { MobileNav } from "./mobile-nav";

export async function MainNav() {
  const user = await getCurrentUser();

  return (
    <div className="container flex h-16 items-center justify-between gap-2 px-2 py-4 md:px-8">
      <div className="flex items-center space-x-4">
        <MobileNav>
          <PageNav
            className="flex flex-col space-y-2 text-left text-sm font-semibold"
            user={user}
          />
        </MobileNav>
        <Link href="/">
          <p className="flex items-center text-2xl font-bold">
            <FeatherIcon className="mr-2 h-8 w-8" />{" "}
            <span className="hidden text-nowrap md:block">Mizo Apologia</span>
          </p>
        </Link>
      </div>
      <PageNav
        className="hidden items-center space-x-2 overflow-x-auto text-sm font-semibold md:flex"
        user={user}
      />
      <div className="flex items-center justify-center space-x-4 md:space-x-6">
        <OramaSearchBox />
        {user ? (
          <>
            <AskDialog />
            <UserAccountNav
              user={{
                name: user?.name ?? null,
                image: user?.image ?? null,
                email: user?.email ?? "",
                username: user?.username,
              }}
            />
          </>
        ) : (
          <div className="flex space-x-3">
            <Link
              className={cn(buttonVariants({ variant: "outline" }))}
              href="/login"
            >
              Log in
            </Link>
            <Link
              className={cn(buttonVariants({ variant: "default" }))}
              href="/register"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
