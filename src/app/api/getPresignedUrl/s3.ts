import { env } from "@/env";
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import { promisify } from "util";
const randomBytes = promisify(crypto.randomBytes);

// ENV Keys
const region = env.S3_REGION;
const bucketName = env.S3_BUCKET;
const accessKeyId = env.S3_ACCESS_KEY_ID;
const secretAccessKey = env.S3_SECRET_ACCESS_KEY;

// Setup s3 client
const client = new S3Client({
  region,
  credentials: {
    accessKeyId: accessKeyId!,
    secretAccessKey: secretAccessKey!,
  },
});

// Presigned URL function
export async function grenerateUploadURL(fileName: string) {
  const rawBytes = await randomBytes(16);
  const imageName = rawBytes.toString("hex") + "_" + fileName;

  const params: PutObjectCommandInput = {
    Bucket: bucketName,
    Key: imageName,
  };

  const command = new PutObjectCommand(params);

  try {
    const signedUrl = await getSignedUrl(client, command, {
      expiresIn: 60 * 60 * 12,
    });
    return signedUrl;
  } catch (err) {
    throw new Error("Failed to fetch Signed URL");
  }
}
