import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { db } = await import("@/db");
  const { dailyShlokas } = await import("@/db/schema");
  const rows = await db.select().from(dailyShlokas).orderBy(dailyShlokas.createdAt);
  return NextResponse.json(rows);
}

export async function POST(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { db } = await import("@/db");
  const { dailyShlokas } = await import("@/db/schema");

  const [row] = await db
    .insert(dailyShlokas)
    .values({
      shloka: body.shloka,
      translationEn: body.translationEn || null,
      translationHi: body.translationHi || null,
      translationMr: body.translationMr || null,
      displayDate: body.displayDate || null,
    })
    .returning();

  return NextResponse.json(row);
}
