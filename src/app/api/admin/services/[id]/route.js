import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";

async function getDb() {
  const { db } = await import("@/db");
  const { services } = await import("@/db/schema");
  const { eq } = await import("drizzle-orm");
  return { db, services, eq };
}

export async function GET(request, { params }) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { db, services, eq } = await getDb();
  const rows = await db.select().from(services).where(eq(services.id, Number(id))).limit(1);
  if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function PUT(request, { params }) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { db, services, eq } = await getDb();

  const [row] = await db
    .update(services)
    .set({
      slug: body.slug,
      category: body.category,
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
      pdfUrl: body.pdfUrl || null,
      aartiEn: body.aartiEn || null,
      aartiHi: body.aartiHi || null,
      aartiMr: body.aartiMr || null,
      isActive: body.isActive ?? true,
      sortOrder: body.sortOrder || 0,
      updatedAt: new Date(),
    })
    .where(eq(services.id, Number(id)))
    .returning();

  return NextResponse.json(row);
}

export async function DELETE(request, { params }) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { db, services, eq } = await getDb();
  await db.delete(services).where(eq(services.id, Number(id)));
  return NextResponse.json({ ok: true });
}
