import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";

export async function DELETE(request, { params }) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  if (String(session.userId) === String(id)) {
    return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 });
  }

  const { db } = await import("@/db");
  const { adminUsers } = await import("@/db/schema");
  const { eq } = await import("drizzle-orm");
  await db.delete(adminUsers).where(eq(adminUsers.id, Number(id)));
  return NextResponse.json({ ok: true });
}
