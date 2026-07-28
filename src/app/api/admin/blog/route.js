import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { revalidatePublicPages } from "@/lib/revalidatePages";

export async function GET(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { db } = await import("@/db");
  const { blogPosts } = await import("@/db/schema");
  const { desc } = await import("drizzle-orm");
  const rows = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  return NextResponse.json(rows);
}

export async function POST(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const { db } = await import("@/db");
  const { blogPosts } = await import("@/db/schema");

  const { slug, titleEn, titleHi, titleMr, bodyEn, bodyHi, bodyMr, coverImageUrl, isPublished } = body;
  const [row] = await db
    .insert(blogPosts)
    .values({
      slug,
      titleEn: titleEn || null,
      titleHi: titleHi || null,
      titleMr: titleMr || null,
      bodyEn: bodyEn || null,
      bodyHi: bodyHi || null,
      bodyMr: bodyMr || null,
      coverImageUrl: coverImageUrl || null,
      isPublished: isPublished ?? false,
      publishedAt: isPublished ? new Date() : null,
    })
    .returning();
  revalidatePublicPages("blog", slug);
  return NextResponse.json(row);
}
