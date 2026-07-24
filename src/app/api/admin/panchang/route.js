import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date") || new Date().toISOString().slice(0, 10);

  const { db } = await import("@/db");
  const { panchangEntries } = await import("@/db/schema");
  const { eq } = await import("drizzle-orm");

  const rows = await db.select().from(panchangEntries).where(eq(panchangEntries.entryDate, date)).limit(1);
  return NextResponse.json(rows[0] || { entryDate: date });
}

export async function POST(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { db } = await import("@/db");
  const { panchangEntries } = await import("@/db/schema");
  const { eq } = await import("drizzle-orm");

  const existing = await db
    .select()
    .from(panchangEntries)
    .where(eq(panchangEntries.entryDate, body.entryDate))
    .limit(1);

  const values = { ...body, isManualOverride: true, updatedAt: new Date() };

  const row = existing[0]
    ? (await db.update(panchangEntries).set(values).where(eq(panchangEntries.entryDate, body.entryDate)).returning())[0]
    : (await db.insert(panchangEntries).values(values).returning())[0];

  return NextResponse.json(row);
}
