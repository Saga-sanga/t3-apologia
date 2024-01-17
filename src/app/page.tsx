import Link from "next/link";

import { CreatePost } from "@/app/_components/create-post";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { signIn } from "next-auth/react";

export default async function Home() {
  // const session = await getServerAuthSession();
  const data = await api.post.hello.query({ text: "Sangs" });

  return (
    <main>
      <h1>{data.greeting}</h1>
      {/* <button onClick={() => signIn()}>Sign In</button> */}
    </main>
  );
}
