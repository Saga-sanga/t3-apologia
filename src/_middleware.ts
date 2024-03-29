import { getSession } from "next-auth/react";
import { type NextRequest, NextResponse } from "next/server";

type Session = {
  user: {
    name: string;
    email: string;
    image: string;
    id: string;
    role: string;
    completedOnboarding: boolean;
  };
  expires: string;
};

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api/ routes
     * 2. /_next/ (Next.js internals)
     * 3. /_proxy/ (special page for OG tags proxying)
     * 4. /_static (inside /public)
     * 5. /_vercel (Vercel internals)
     * 6. Static files (e.g. /favicon.ico, /sitemap.xml, /robots.txt, etc.)
     */
    // "/((?!api/|_next/|_proxy/|_static|_vercel|[\\w-]+\\.\\w+).*)",
    "/",
  ],
};

export default async function middleware(req: NextRequest) {
  // const nextAuthReq = {
  //   headers: {
  //     cookie: req.headers.get("cookie") ?? undefined,
  //   },
  // };

  // const session = (await getSession({ req: nextAuthReq })) as Session;

  const resSession = await fetch(
    process.env.NEXTAUTH_URL + "/api/auth/session",
    {
      headers: {
        "Content-Type": "application/json",
        Cookie: req.headers.get("cookie") || "",
      },
      method: "GET",
    },
  );
  const session = (await resSession.json()) as Session;

  console.log({ session });

  if (session.user && !session?.user.completedOnboarding) {
    return NextResponse.redirect(new URL("/welcome", req.url));
  }
}
