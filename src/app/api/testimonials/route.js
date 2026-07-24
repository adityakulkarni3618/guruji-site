import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    
    if (!body.customerName || !body.textEn) {
      return NextResponse.json({ error: "Name and review text are required." }, { status: 400 });
    }

    const { db } = await import("@/db");
    const { testimonials } = await import("@/db/schema");

    const [row] = await db
      .insert(testimonials)
      .values({
        customerName: body.customerName,
        city: body.city || null,
        textEn: body.textEn,
        textMr: body.textMr || body.textEn, // fallback to avoid empty translations
        textHi: body.textHi || body.textEn,
        rating: Number(body.rating) || 5,
        isApproved: false, // Must be approved by admin to show up!
      })
      .returning();

    return NextResponse.json(row);
  } catch (err) {
    console.error("Testimonial submission failed:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
