import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";

export async function PUT(request, { params }) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { db } = await import("@/db");
  const { inquiries } = await import("@/db/schema");
  const { eq } = await import("drizzle-orm");
  const [row] = await db.update(inquiries).set({ isRead: true }).where(eq(inquiries.id, Number(id))).returning();
  return NextResponse.json(row);
}
