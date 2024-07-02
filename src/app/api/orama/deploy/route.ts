import { env } from "@/env";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";

async function handler() {
  console.log("Starting deployment");
  // const deployRes = await fetch(`${env.ORAMA_BASE_URL}/deploy`, {
  //   headers: {
  //     Authorization: `Bearer ${env.ORAMA_PRIVATE_API_KEY}`,
  //   },
  //   method: "POST",
  // });

  // if (deployRes.ok) {
  //   console.log("Orama Search index deployed");
  //   return Response.json({ message: "OK" }, { status: 200 });
  // } else {
  //   console.log(deployRes);
  //   return Response.json({ message: "Error" }, { status: 500 });
  // }

  return Response.json({ success: true });
}

export const POST = verifySignatureAppRouter(handler);
