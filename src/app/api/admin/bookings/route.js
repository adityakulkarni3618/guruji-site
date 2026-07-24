import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { db } = await import("@/db");
  const { bookings, services } = await import("@/db/schema");
  const { desc } = await import("drizzle-orm");

  const rows = await db.select().from(bookings).orderBy(desc(bookings.createdAt));
  const allServices = await db.select().from(services);
  const serviceMap = Object.fromEntries(allServices.map((s) => [s.id, s.nameEn]));

  return NextResponse.json(rows.map((b) => ({ ...b, serviceName: serviceMap[b.serviceId] || "—" })));
}
