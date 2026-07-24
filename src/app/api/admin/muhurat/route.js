import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { db } = await import("@/db");
  const { muhuratDates } = await import("@/db/schema");
  const rows = await db.select().from(muhuratDates);
  return NextResponse.json(rows.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate)));
}

export async function POST(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const { db } = await import("@/db");
  const { muhuratDates } = await import("@/db/schema");
  const [row] = await db.insert(muhuratDates).values(body).returning();
  return NextResponse.json(row);
}
