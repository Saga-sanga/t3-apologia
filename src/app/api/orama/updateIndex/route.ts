import { db } from "@/server/db";
import { Client } from "@upstash/qstash";
import { env } from "@/env";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";

const client = new Client({ token: env.QSTASH_TOKEN });

const queue = client.queue({
  queueName: "oramaUpdate",
});

async function handler() {
  // const currentBaseUrl = new URL("api/orama/", request.nextUrl.origin);

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

  // Use qstash queue to update Orama Index
  await Promise.all(
    formattedData.map(async (post) => {
      const response = await queue.enqueueJSON({
        url: `${env.ORAMA_BASE_URL}/notify`,
        headers: {
          Authorization: `Bearer ${env.ORAMA_PRIVATE_API_KEY}`,
        },
        body: { upsert: [post] },
      });

      if (response.messageId) {
        console.log("starting job with messageID: ", response.messageId);
      } else {
        console.log("Cannot start QStash job");
      }
    }),
  );

  //use qstash to deploy
  const res = await queue.enqueueJSON({
    url: `${env.ORAMA_BASE_URL}/deploy`,
    headers: {
      Authorization: `Bearer ${env.ORAMA_PRIVATE_API_KEY}`,
    },
  });

  if (res.messageId) {
    console.log("starting deploy job with messageID: ", res.messageId);
  } else {
    console.log("Cannot start depolyment job");
    return Response.json({ success: false }, { status: 500 });
  }

  return Response.json({ success: true });
}

export const POST = verifySignatureAppRouter(handler);
