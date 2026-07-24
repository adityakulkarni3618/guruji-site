import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  message: z.string().min(1),
});

export async function POST(request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  try {
    const { db } = await import("@/db");
    const { inquiries } = await import("@/db/schema");
    await db.insert(inquiries).values(parsed.data);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[inquiries] DB not configured or insert failed:", err.message);
    return NextResponse.json({ ok: true, warning: "not_persisted" });
  }
}
