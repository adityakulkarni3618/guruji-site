import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";

export async function DELETE(request, { params }) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { db } = await import("@/db");
  const { muhuratDates } = await import("@/db/schema");
  const { eq } = await import("drizzle-orm");
  await db.delete(muhuratDates).where(eq(muhuratDates.id, Number(id)));
  return NextResponse.json({ ok: true });
}
