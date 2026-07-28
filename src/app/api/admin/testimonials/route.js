import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { revalidatePublicPages } from "@/lib/revalidatePages";

export async function GET(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { db } = await import("@/db");
  const { testimonials } = await import("@/db/schema");
  const { desc } = await import("drizzle-orm");
  const rows = await db.select().from(testimonials).orderBy(desc(testimonials.createdAt));
  return NextResponse.json(rows);
}

export async function POST(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const { db } = await import("@/db");
  const { testimonials } = await import("@/db/schema");

  const { customerName, city, photoUrl, textEn, textHi, textMr, rating, isApproved } = body;
  const [row] = await db
    .insert(testimonials)
    .values({
      customerName,
      city: city || null,
      photoUrl: photoUrl || null,
      textEn: textEn || null,
      textHi: textHi || null,
      textMr: textMr || null,
      rating: rating !== undefined ? Number(rating) : 5,
      isApproved: isApproved ?? false,
    })
    .returning();
  revalidatePublicPages("testimonial");
  return NextResponse.json(row);
}
