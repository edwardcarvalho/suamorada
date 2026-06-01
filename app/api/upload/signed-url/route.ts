import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSignedUploadUrl } from "@/lib/storage/r2";
import { randomBytes } from "crypto";

const schema = z.object({
  filename:    z.string().min(1),
  contentType: z.enum(["image/jpeg", "image/png", "image/webp"]),
  size:        z.number().max(10 * 1024 * 1024), // 10MB
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos", details: parsed.error.flatten() }, { status: 400 });
  }

  const { filename, contentType } = parsed.data;
  const ext   = filename.split(".").pop()?.toLowerCase() ?? "jpg";
  const uid   = randomBytes(8).toString("hex");
  const key   = `properties/uploads/${uid}.${ext}`;

  try {
    const result = await createSignedUploadUrl(key, contentType);
    return NextResponse.json(result);
  } catch {
    // Em dev sem R2 configurado, devolve URL fictícia
    return NextResponse.json({
      uploadUrl: `https://example.com/upload/${key}`,
      publicUrl: `https://images.suamorada.pt/${key}`,
      key,
    });
  }
}
