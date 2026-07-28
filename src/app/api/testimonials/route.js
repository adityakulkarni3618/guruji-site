import { NextResponse } from "next/server";
import { z } from "zod";

const testimonialSchema = z.object({
  customerName: z.string().min(1, "Name is required").max(160, "Name is too long"),
  city: z.string().max(120, "City name is too long").optional().or(z.literal("")),
  photoUrl: z.string().url().optional().or(z.literal("")),
  textEn: z.string().min(1, "Review text is required").max(1000, "Review is too long"),
  textMr: z.string().max(1000).optional().or(z.literal("")),
  textHi: z.string().max(1000).optional().or(z.literal("")),
  rating: z.coerce.number().int().min(1).max(5).default(5),
});

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = testimonialSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message || "Invalid input" }, { status: 400 });
    }

    const data = parsed.data;

    const { db } = await import("@/db");
    const { testimonials } = await import("@/db/schema");

    const [row] = await db
      .insert(testimonials)
      .values({
        customerName: data.customerName,
        city: data.city || null,
        photoUrl: data.photoUrl || null,
        textEn: data.textEn,
        textMr: data.textMr || data.textEn,
        textHi: data.textHi || data.textEn,
        rating: data.rating,
        isApproved: false, // Must be approved by admin to show up!
      })
      .returning();

    return NextResponse.json(row);
  } catch (err) {
    console.error("Testimonial submission failed:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
