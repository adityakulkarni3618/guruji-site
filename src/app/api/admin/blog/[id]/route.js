import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET(request, { params }) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { db } = await import("@/db");
  const { blogPosts } = await import("@/db/schema");
  const { eq } = await import("drizzle-orm");
  const rows = await db.select().from(blogPosts).where(eq(blogPosts.id, Number(id))).limit(1);
  return NextResponse.json(rows[0] || null);
}

export async function PUT(request, { params }) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await request.json();
  const { db } = await import("@/db");
  const { blogPosts } = await import("@/db/schema");
  const { eq } = await import("drizzle-orm");
  const [row] = await db
    .update(blogPosts)
    .set({ ...body, publishedAt: body.isPublished ? new Date() : null })
    .where(eq(blogPosts.id, Number(id)))
    .returning();
  return NextResponse.json(row);
}

export async function DELETE(request, { params }) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { db } = await import("@/db");
  const { blogPosts } = await import("@/db/schema");
  const { eq } = await import("drizzle-orm");
  await db.delete(blogPosts).where(eq(blogPosts.id, Number(id)));
  return NextResponse.json({ ok: true });
}
