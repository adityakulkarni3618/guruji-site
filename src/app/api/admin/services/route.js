import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { db } = await import("@/db");
  const { services } = await import("@/db/schema");
  const rows = await db.select().from(services).orderBy(services.sortOrder);
  return NextResponse.json(rows);
}

export async function POST(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { db } = await import("@/db");
  const { services } = await import("@/db/schema");

  const [row] = await db
    .insert(services)
    .values({
      slug: body.slug,
      category: body.category || "pooja",
      nameEn: body.nameEn,
      nameHi: body.nameHi || null,
      nameMr: body.nameMr || null,
      shortDescEn: body.shortDescEn || null,
      shortDescHi: body.shortDescHi || null,
      shortDescMr: body.shortDescMr || null,
      descriptionEn: body.descriptionEn || null,
      descriptionHi: body.descriptionHi || null,
      descriptionMr: body.descriptionMr || null,
      samagri: body.samagri || [],
      durationMinutes: body.durationMinutes || null,
      price: body.price || null,
      priceNote: body.priceNote || null,
      imageUrl: body.imageUrl || null,
      isActive: body.isActive ?? true,
      sortOrder: body.sortOrder || 0,
    })
    .returning();

  return NextResponse.json(row);
}
