import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";

async function getDb() {
  const { db } = await import("@/db");
  const { dailyShlokas } = await import("@/db/schema");
  const { eq } = await import("drizzle-orm");
  return { db, dailyShlokas, eq };
}

export async function GET(request, { params }) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { db, dailyShlokas, eq } = await getDb();
  const rows = await db.select().from(dailyShlokas).where(eq(dailyShlokas.id, Number(id))).limit(1);
  if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function PUT(request, { params }) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { db, dailyShlokas, eq } = await getDb();

  const [row] = await db
    .update(dailyShlokas)
    .set({
      shloka: body.shloka,
      translationEn: body.translationEn || null,
      translationHi: body.translationHi || null,
      translationMr: body.translationMr || null,
      displayDate: body.displayDate || null,
    })
    .where(eq(dailyShlokas.id, Number(id)))
    .returning();

  return NextResponse.json(row);
}

export async function DELETE(request, { params }) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { db, dailyShlokas, eq } = await getDb();
  await db.delete(dailyShlokas).where(eq(dailyShlokas.id, Number(id)));
  return NextResponse.json({ ok: true });
}
