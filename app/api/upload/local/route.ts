/**
 * Upload local para desenvolvimento (sem R2).
 * Guarda ficheiros em /public/uploads/ e devolve /uploads/{filename}
 * NÃO usar em produção.
 */
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function PUT(req: NextRequest) {
  const filename = req.nextUrl.searchParams.get("key");
  if (!filename) return NextResponse.json({ error: "key em falta" }, { status: 400 });

  try {
    const buffer = Buffer.from(await req.arrayBuffer());
    const dir    = path.join(process.cwd(), "public", "uploads");

    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), buffer);

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("[upload/local]", err);
    return NextResponse.json({ error: "Erro ao guardar ficheiro" }, { status: 500 });
  }
}
