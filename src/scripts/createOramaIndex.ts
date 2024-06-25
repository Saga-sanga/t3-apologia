import { env } from "@/env";
import { db } from "@/server/db";
import { inspect } from "node:util";

type IndexSchema = {
  id: string;
  title: string;
  content: string;
  category: string;
  description: string;
};

async function uploadToOrama() {
  console.log("Starting Indexing...");

  // Clear out Index
  const res = await fetch(`${env.ORAMA_BASE_URL}/snapshot`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.ORAMA_PRIVATE_API_KEY}`,
    },
    method: "POST",
    body: JSON.stringify([]),
  });

  if (res.ok) {
    console.log("Cleared Orama Index");
  } else {
    console.log(res);
  }

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

  // console.log(inspect(posts, true, null, true));

  const promises = posts.map(async (post) => {
    const resp = await fetch(`${env.ORAMA_BASE_URL}/notify`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.ORAMA_PRIVATE_API_KEY}`,
      },
      method: "POST",
      body: JSON.stringify({
        upsert: [
          {
            id: `post/${post.id}`,
            category: post.category?.name ?? "",
            title: post.title ?? "",
            description: post.description ?? "",
            content: JSON.stringify(post.content),
          } satisfies IndexSchema,
        ],
      }),
    });

    console.log(post.title, resp.status);
  });

  await Promise.all(promises);
}

export async function createOramaIndex() {
  await uploadToOrama();

  const deployRes = await fetch(`${env.ORAMA_BASE_URL}/deploy`, {
    headers: {
      Authorization: `Bearer ${env.ORAMA_PRIVATE_API_KEY}`,
    },
    method: "POST",
  });

  if (deployRes.ok) {
    console.log("Orama Search index deployed");
  } else {
    console.log(deployRes);
  }
}

createOramaIndex();
