import { buttonVariants } from "@/components/ui/button";
import UserAuthForm from "@/components/user-auth-form";
import { cn } from "@/lib/utils";
import { FeatherIcon, ListTodo } from "lucide-react";
import Link from "next/link";

export default async function Page() {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <div className="col-span-1 hidden flex-col bg-primary p-10 text-background lg:flex">
        <Link href="/" className=" flex items-center text-2xl font-bold">
          <FeatherIcon className="mr-2 h-10 w-10 stroke-background" />
          Mizo Apologia
        </Link>
        <div className="mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This todo app has saved me countless hours of work and
              helped me deliver stunning designs to my clients faster than ever
              before.&rdquo;
            </p>
            <footer className="text-sm">Mike Hawk</footer>
          </blockquote>
        </div>
      </div>
      <div className="relative col-span-1 grid place-content-center space-y-6">
        <Link
          className={cn(
            "absolute right-4 top-4 md:right-8 md:top-8",
            buttonVariants({ variant: "ghost" }),
          )}
          href="/login"
        >
          Login
        </Link>
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email below to create your account
          </p>
        </div>
        <UserAuthForm />
        <p className="px-8 text-center text-sm text-muted-foreground sm:w-80">
          By clicking continue, you agree to our{" "}
          <Link
            className="underline underline-offset-4 hover:text-primary"
            href="/terms"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            className="underline underline-offset-4 hover:text-primary"
            href="/privacy"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
