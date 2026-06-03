import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const schema = z.object({
  name:  z.string().min(2).max(80).optional(),
  phone: z.string().max(20).optional().nullable(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const [user] = await db.select({
    id:       users.id,
    name:     users.name,
    email:    users.email,
    phone:    users.phone,
    image:    users.image,
    role:     users.role,
  }).from(users).where(eq(users.id, session.user.id)).limit(1);

  if (!user) return NextResponse.json({ error: "Utilizador não encontrado" }, { status: 404 });
  return NextResponse.json(user);
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const body   = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });

  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (parsed.data.name  !== undefined) updates.name  = parsed.data.name;
  if (parsed.data.phone !== undefined) updates.phone = parsed.data.phone;

  await db.update(users).set(updates as never).where(eq(users.id, session.user.id));
  return NextResponse.json({ success: true });
}
