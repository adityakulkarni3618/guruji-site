import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  message: z.string().min(1),
});

async function sendInquiryEmail(data) {
  const subject = `New Contact Form Submission - ${data.name}`;
  const text = `
New Contact Form Submission
A user has submitted a message on the contact form.

Name: ${data.name}
Phone: ${data.phone || "N/A"}
Email: ${data.email || "N/A"}
Message: ${data.message}
  `;
  const html = `
    <h3>New Contact Form Submission</h3>
    <p>A user has submitted a message on the contact form.</p>
    <hr />
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Phone:</strong> ${data.phone || "N/A"}</p>
    <p><strong>Email:</strong> ${data.email || "N/A"}</p>
    <p><strong>Message:</strong></p>
    <p style="white-space: pre-line;">${data.message}</p>
  `;

  // Try SMTP first, fallback to Resend if SMTP is not configured but Resend is
  if (process.env.SMTP_HOST) {
    try {
      const { sendEmailNotification } = await import("@/lib/notifications");
      await sendEmailNotification({ subject, text, html });
      return;
    } catch (err) {
      console.error("[inquiries] SMTP notification failed, trying Resend fallback...", err);
    }
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.ADMIN_EMAIL || "rahuljoshi031986@gmail.com";

  if (!apiKey) {
    console.log("⚠️ [inquiries] Neither SMTP nor RESEND_API_KEY is configured. Skipping email dispatch. Inquiry details:", data);
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
        from: "Guruji Inquiries <onboarding@resend.dev>",
        to: toEmail,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[inquiries] Resend API error details:", errText);
    } else {
      console.log(`[inquiries] Notification email dispatched successfully to ${toEmail}`);
    }
  } catch (err) {
    console.error("[inquiries] Email dispatch failed:", err.message);
  }
}

export async function POST(request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const data = parsed.data;

  try {
    const { db } = await import("@/db");
    const { inquiries } = await import("@/db/schema");
    await db.insert(inquiries).values(data);
    
    // Trigger notification email
    sendInquiryEmail(data);
    
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[inquiries] DB not configured or insert failed:", err.message);
    // Send email even if db save fails
    sendInquiryEmail(data);
    return NextResponse.json({ ok: true, warning: "not_persisted" });
  }
}
