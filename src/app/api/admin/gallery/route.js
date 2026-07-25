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
  const [row] = await db.insert(galleryItems).values(body).returning();
  revalidatePublicPages("gallery");
  return NextResponse.json(row);
}
