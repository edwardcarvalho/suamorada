import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId:     process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.CLOUDFLARE_R2_BUCKET_NAME ?? "suamorada-images";
const PUBLIC = process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? "";

export async function createSignedUploadUrl(key: string, contentType: string) {
  const cmd = new PutObjectCommand({
    Bucket: BUCKET,
    Key:    key,
    ContentType: contentType,
  });
  const uploadUrl = await getSignedUrl(r2, cmd, { expiresIn: 300 });
  const publicUrl = `${PUBLIC}/${key}`;
  return { uploadUrl, publicUrl, key };
}
