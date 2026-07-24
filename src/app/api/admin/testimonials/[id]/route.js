import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";

export async function PUT(request, { params }) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await request.json();
  const { db } = await import("@/db");
  const { testimonials } = await import("@/db/schema");
  const { eq } = await import("drizzle-orm");
  const [row] = await db
    .update(testimonials)
    .set({ isApproved: body.isApproved })
    .where(eq(testimonials.id, Number(id)))
    .returning();
  return NextResponse.json(row);
}

export async function DELETE(request, { params }) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { db } = await import("@/db");
  const { testimonials } = await import("@/db/schema");
  const { eq } = await import("drizzle-orm");
  await db.delete(testimonials).where(eq(testimonials.id, Number(id)));
  return NextResponse.json({ ok: true });
}
