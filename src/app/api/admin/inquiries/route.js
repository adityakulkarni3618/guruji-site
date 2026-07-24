import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { db } = await import("@/db");
  const { inquiries } = await import("@/db/schema");
  const { desc } = await import("drizzle-orm");
  const rows = await db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
  return NextResponse.json(rows);
}
