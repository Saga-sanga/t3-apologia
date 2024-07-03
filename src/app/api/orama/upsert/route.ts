import { env } from "@/env";
import { postSchema } from "@/lib/validators";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";

async function handler(req: Request) {
  // Add zod validation
  const post = postSchema.parse(await req.json());

  const resp = await fetch(`${env.ORAMA_BASE_URL}/notify`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.ORAMA_PRIVATE_API_KEY}`,
    },
    method: "POST",
    body: JSON.stringify({ upsert: [post] }),
  });

  console.log(post.title ?? post.id, resp.status);

  if (resp.ok) {
    return Response.json({ success: true }, { status: 200 });
  }

  return Response.json({ success: false }, { status: 500 });
}

export const POST = verifySignatureAppRouter(handler);
