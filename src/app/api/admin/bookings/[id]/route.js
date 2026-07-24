import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";

export async function PUT(request, { params }) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { status } = await request.json();

  const { db } = await import("@/db");
  const { bookings } = await import("@/db/schema");
  const { eq } = await import("drizzle-orm");

  const [row] = await db
    .update(bookings)
    .set({ status })
    .where(eq(bookings.id, Number(id)))
    .returning();

  return NextResponse.json(row);
}
