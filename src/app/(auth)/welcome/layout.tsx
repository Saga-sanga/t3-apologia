import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function WelcomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen items-center bg-accent">
      <article className="mx-auto w-full space-y-10 py-16 sm:max-w-xl">
        <div className="mx-auto w-full px-6 sm:max-w-lg">
          <header className="w-full">
            <h1 className="mb-3 text-3xl font-semibold tracking-wide">
              Welcome to Mizo Apologia
            </h1>
            <p className="text-sm text-muted-foreground">
              I profile siam nan I chanchin tlem kanlo zawt lawk a che.
            </p>
            <p className="text-sm text-muted-foreground">
              Henghi nakinah i duh chuan i thlak leh vek thei.
            </p>
          </header>
          {/* <div className="mt-6 space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              Step 1 of 2
            </p>
            <div className="flex space-x-2">
              <div className="h-1 w-full rounded-[1px] bg-primary"></div>
              <div className="h-1 w-full rounded-[1px] bg-primary/25"></div>
            </div>
          </div> */}
        </div>
        {children}
      </article>
    </main>
  );
}
