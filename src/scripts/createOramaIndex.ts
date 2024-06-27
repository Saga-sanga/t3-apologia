import { env } from "@/env";
import { db } from "@/server/db";
import { deployOramaIndex, upsertOramaIndex } from "./oramaMethods";
// import { inspect } from "node:util";

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

  const promises = posts.map(async (post) => upsertOramaIndex(post, true));

  await Promise.all(promises);
}

export async function createOramaIndex() {
  await uploadToOrama();

  await deployOramaIndex();
}

createOramaIndex();
