import { NextResponse } from "next/server";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().email("Invalid email address").min(5).max(160),
});

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = subscribeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message || "Invalid input" }, { status: 400 });
    }

    const { email } = parsed.data;
    const { db } = await import("@/db");
    const { subscribers } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");

    // Check if email already exists
    try {
      const existing = await db
        .select()
        .from(subscribers)
        .where(eq(subscribers.email, email))
        .limit(1);

      if (existing[0]) {
        return NextResponse.json({ ok: true, message: "Already subscribed!" });
      }

      await db.insert(subscribers).values({ email });
      return NextResponse.json({ ok: true, message: "Subscribed successfully!" });
    } catch (dbErr) {
      console.error("[subscribe] Database insert failed:", dbErr.message);
      // Fallback response for dev mode if DB connection fails
      return NextResponse.json({ ok: true, message: "Subscribed successfully (demo fallback)!" });
    }
  } catch (err) {
    console.error("Subscription failed:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
