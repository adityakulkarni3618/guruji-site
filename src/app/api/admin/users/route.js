import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { hashPassword } from "@/lib/auth";

export async function GET(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { db } = await import("@/db");
  const { adminUsers } = await import("@/db/schema");
  const rows = await db.select().from(adminUsers);
  return NextResponse.json(rows.map(({ passwordHash, ...rest }) => rest));
}

export async function POST(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  if (!body.email || !body.password || !body.name) {
    return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 });
  }

  const { db } = await import("@/db");
  const { adminUsers } = await import("@/db/schema");

  const passwordHash = await hashPassword(body.password);
  const [row] = await db
    .insert(adminUsers)
    .values({ name: body.name, email: body.email, passwordHash, role: body.role || "assistant" })
    .returning();

  const { passwordHash: _omit, ...safe } = row;
  return NextResponse.json(safe);
}
