import { db } from "@/server/db";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { Client } from "@upstash/qstash";
import { env } from "@/env";
import type { NextRequest } from "next/server";

const client = new Client({ token: env.QSTASH_TOKEN });

async function handler(request: NextRequest) {
  // Create a huge payload i.e. the upsert object
  const callbackUrl = new URL("api/orama/deploy", request.nextUrl.origin);

  const posts = await db.query.posts.findMany({
    columns: {
      id: true,
      title: true,
      description: true,
      content: true,
    },
    where: (posts, { eq }) => eq(posts.state, "published"),
    with: {
      category: {
        columns: {
          name: true,
        },
      },
    },
  });

  const formattedData = posts.map((post) => ({
    id: `post/${post.id}`,
    category: post.category?.name ?? "",
    title: post.title ?? "",
    description: post.description ?? "",
    content: JSON.stringify(post.content),
  }));

  // Send paylod to Orama using qstash
  const res = await client.publishJSON({
    url: `${env.ORAMA_BASE_URL}/notify`,
    body: JSON.stringify({ upsert: formattedData }),
    callback: callbackUrl.href,
  });

  if (res.messageId) {
    console.log(`Starting job with messageID: ${res.messageId}`);
    return Response.json({ success: true });
  } else {
    console.log("Failed to start Qstash process");
  }

  return Response.json({ success: false });
}

export const GET = verifySignatureAppRouter(handler);
