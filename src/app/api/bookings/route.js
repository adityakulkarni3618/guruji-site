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

async function sendBookingEmail(data, serviceName) {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.ADMIN_EMAIL || "rahuljoshi031986@gmail.com";
  
  if (!apiKey) {
    console.log("⚠️ [bookings] RESEND_API_KEY is not configured. Skipping email dispatch. Booking details:", data);
    return;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "Guruji Bookings <onboarding@resend.dev>",
        to: toEmail,
        subject: `New Pooja Booking Request - ${data.name}`,
        html: `
          <h3>New Pooja Booking Request</h3>
          <p>A devotee has submitted an appointment request on the website.</p>
          <hr />
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <p><strong>Email:</strong> ${data.email || "N/A"}</p>
          <p><strong>City:</strong> ${data.city || "N/A"}</p>
          <p><strong>Service:</strong> ${serviceName || "Other"}</p>
          <p><strong>Preferred Date:</strong> ${data.date || "N/A"}</p>
          <p><strong>Preferred Time:</strong> ${data.time || "N/A"}</p>
          <p><strong>Notes:</strong> ${data.notes || "None"}</p>
        `,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[bookings] Resend API error details:", errText);
    } else {
      console.log(`[bookings] Notification email dispatched successfully to ${toEmail}`);
    }
  } catch (err) {
    console.error("[bookings] Email dispatch failed:", err.message);
  }
}

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
    let serviceName = "Other Pooja";
    if (data.serviceSlug) {
      const rows = await db.select().from(services).where(eq(services.slug, data.serviceSlug)).limit(1);
      serviceId = rows[0]?.id || null;
      serviceName = rows[0]?.nameEn || "Other Pooja";
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

    // Trigger email notification in background
    sendBookingEmail(data, serviceName);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[bookings] DB not configured or insert failed:", err.message);
    // Trigger background email even if DB insert fails in demo mode
    sendBookingEmail(data, "Other Pooja");
    return NextResponse.json({ ok: true, warning: "not_persisted" });
  }
}
