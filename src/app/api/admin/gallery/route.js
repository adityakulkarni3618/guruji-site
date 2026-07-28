import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { revalidatePublicPages } from "@/lib/revalidatePages";

export async function GET(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { db } = await import("@/db");
  const { galleryItems } = await import("@/db/schema");
  const rows = await db.select().from(galleryItems);
  return NextResponse.json(rows);
}

export async function POST(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const { db } = await import("@/db");
  const { galleryItems } = await import("@/db/schema");

  const { mediaType, url, captionEn, captionHi, captionMr, sortOrder } = body;
  const [row] = await db
    .insert(galleryItems)
    .values({
      mediaType: mediaType || "image",
      url,
      captionEn: captionEn || null,
      captionHi: captionHi || null,
      captionMr: captionMr || null,
      sortOrder: sortOrder ? Number(sortOrder) : 0,
    })
    .returning();
  revalidatePublicPages("gallery");
  return NextResponse.json(row);
}
