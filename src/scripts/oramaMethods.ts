"use server";
import { env } from "@/env";

type Post = {
  id: string;
  content?: unknown;
  title?: string | null;
  description?: string | null;
  category?: {
    name: string | null;
  } | null;
};

type IndexSchema = {
  id: string;
  title: string;
  content: string;
  category: string;
  description: string;
};

export async function upsertOramaIndex(post: Post, batch = false) {
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

  console.log(post?.title ?? post.id, resp.status);
  if (!batch) {
    console.log("Deploying Individual upsert");
    await deployOramaIndex();
  }

  return resp;
}

export async function deleteOramaItem(id: string) {
  const resp = await fetch(`${env.ORAMA_BASE_URL}/notify`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.ORAMA_PRIVATE_API_KEY}`,
    },
    method: "POST",
    body: JSON.stringify({
      remove: [id],
    }),
  });

  console.log("Deleted ", id, resp.status);
  await deployOramaIndex();
}

export async function deployOramaIndex() {
  console.log("Starting deployment");
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
