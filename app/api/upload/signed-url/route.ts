import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { randomBytes } from "crypto";
import { createSignedUploadUrl } from "@/lib/storage/r2";

const schema = z.object({
  filename:    z.string().min(1),
  contentType: z.enum(["image/jpeg", "image/png", "image/webp"]),
  size:        z.number().max(10 * 1024 * 1024),
});

export async function POST(req: NextRequest) {
  const body   = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const { filename, contentType } = parsed.data;
  const ext = filename.split(".").pop()?.toLowerCase() ?? "jpg";
  const uid = randomBytes(8).toString("hex");
  const key = `properties/uploads/${uid}.${ext}`;

  // ── Produção / Dev com R2 configurado ────────────────────────────────────
  if (process.env.CLOUDFLARE_R2_ACCESS_KEY_ID) {
    try {
      const result = await createSignedUploadUrl(key, contentType);
      return NextResponse.json(result);
    } catch (err) {
      console.error("[signed-url] R2 error:", err);
      return NextResponse.json({ error: "Erro ao gerar URL de upload" }, { status: 500 });
    }
  }

  // ── Dev sem R2: upload local para /public/uploads/ ───────────────────────
  const appUrl  = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001";
  const fileKey = `${uid}.${ext}`;

  return NextResponse.json({
    uploadUrl: `${appUrl}/api/upload/local?key=${fileKey}`,
    publicUrl: `/uploads/${fileKey}`,
    key:       fileKey,
  });
}
