/**
 * Upload de ficheiros via servidor — sem CORS no bucket R2.
 * O browser envia para cá, o servidor faz o upload para R2.
 */
import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomBytes } from "crypto";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE      = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  const formData = await req.formData().catch(() => null);
  if (!formData) return NextResponse.json({ error: "FormData inválido" }, { status: 400 });

  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "Ficheiro em falta" }, { status: 400 });

  if (!ALLOWED_TYPES.includes(file.type))
    return NextResponse.json({ error: "Formato inválido (JPG, PNG ou WebP)" }, { status: 400 });

  if (file.size > MAX_SIZE)
    return NextResponse.json({ error: "Ficheiro demasiado grande (máx. 10MB)" }, { status: 400 });

  const ext    = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const uid    = randomBytes(8).toString("hex");
  const key    = `properties/uploads/${uid}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  // ── Cloudflare R2 ─────────────────────────────────────────────────────────
  if (process.env.CLOUDFLARE_R2_ACCESS_KEY_ID) {
    const r2 = new S3Client({
      region:   "auto",
      endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId:     process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
      },
    });

    await r2.send(new PutObjectCommand({
      Bucket:      process.env.CLOUDFLARE_R2_BUCKET_NAME ?? "suamorada-images",
      Key:         key,
      Body:        buffer,
      ContentType: file.type,
    }));

    const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`;
    return NextResponse.json({ url: publicUrl, key });
  }

  // ── Fallback local (dev sem R2) ────────────────────────────────────────────
  const fileKey = `${uid}.${ext}`;
  const dir     = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, fileKey), buffer);
  return NextResponse.json({ url: `/uploads/${fileKey}`, key: fileKey });
}
