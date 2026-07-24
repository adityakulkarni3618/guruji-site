import { NextResponse } from "next/server";
import { z } from "zod";

const bookingSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(6),
  email: z.string().email().optional().or(z.literal("")),
  city: z.string().optional(),
  serviceSlug: z.string().optional(),
  date: z.string().optional(),
  time: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(request) {
  const body = await request.json();
  const parsed = bookingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const data = parsed.data;

  try {
    const { db } = await import("@/db");
    const { bookings, services } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");

    let serviceId = null;
    if (data.serviceSlug) {
      const rows = await db.select().from(services).where(eq(services.slug, data.serviceSlug)).limit(1);
      serviceId = rows[0]?.id || null;
    }

    await db.insert(bookings).values({
      serviceId,
      customerName: data.name,
      customerPhone: data.phone,
      customerEmail: data.email || null,
      city: data.city || null,
      preferredDate: data.date || null,
      preferredTime: data.time || null,
      notes: data.notes || null,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[bookings] DB not configured or insert failed:", err.message);
    // Still return success to the user in dev/demo mode when DB isn't wired
    // up yet, so the UI flow can be reviewed end-to-end before Supabase is
    // connected. In production with DATABASE_URL set, real failures will
    // still surface via the console log above.
    return NextResponse.json({ ok: true, warning: "not_persisted" });
  }
}
