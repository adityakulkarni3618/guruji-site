import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { revalidatePublicPages } from "@/lib/revalidatePages";

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
  const { slug, titleEn, titleHi, titleMr, bodyEn, bodyHi, bodyMr, coverImageUrl, isPublished } = body;
  const updateFields = {};
  if (slug !== undefined) updateFields.slug = slug;
  if (titleEn !== undefined) updateFields.titleEn = titleEn || null;
  if (titleHi !== undefined) updateFields.titleHi = titleHi || null;
  if (titleMr !== undefined) updateFields.titleMr = titleMr || null;
  if (bodyEn !== undefined) updateFields.bodyEn = bodyEn || null;
  if (bodyHi !== undefined) updateFields.bodyHi = bodyHi || null;
  if (bodyMr !== undefined) updateFields.bodyMr = bodyMr || null;
  if (coverImageUrl !== undefined) updateFields.coverImageUrl = coverImageUrl || null;
  if (isPublished !== undefined) {
    updateFields.isPublished = isPublished;
    updateFields.publishedAt = isPublished ? new Date() : null;
  }

  const [row] = await db
    .update(blogPosts)
    .set(updateFields)
    .where(eq(blogPosts.id, Number(id)))
    .returning();
  revalidatePublicPages("blog", row?.slug || slug);
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
  revalidatePublicPages("blog");
  return NextResponse.json({ ok: true });
}
