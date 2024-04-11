import { buttonVariants } from "@/components/ui/button";
import UserAuthForm from "@/components/forms/user-auth-form";
import { cn } from "@/lib/utils";
import { ChevronLeft, FeatherIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default async function Page() {
  // const session = await getServerAuthSession();

  // if (session) {
  //   redirect("/");
  // }

  return (
    <main className="relative grid min-h-screen place-content-center space-y-6">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 md:left-8 md:top-8",
        )}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back
      </Link>
      <div className="flex flex-col items-center space-y-2 text-center">
        <FeatherIcon className="h-12 w-12" />
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email below to login
        </p>
      </div>
      <UserAuthForm />
      <a
        className="text-center text-sm text-muted-foreground underline"
        href="/register"
      >
        Don't have an account? Sign Up
      </a>
    </main>
  );
}
