import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;

    // 1. Try uploading to Supabase Storage if configured
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey) {
      console.log("Supabase config detected, uploading to Supabase Storage...");
      const cleanUrl = supabaseUrl.endsWith("/") ? supabaseUrl.slice(0, -1) : supabaseUrl;
      const bucketName = "media";
      const uploadUrl = `${cleanUrl}/storage/v1/object/${bucketName}/${filename}`;

      try {
        const response = await fetch(uploadUrl, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${supabaseKey}`,
            "Content-Type": file.type || "application/octet-stream",
            "x-upsert": "true",
          },
          body: buffer,
        });

        if (response.ok) {
          const publicUrl = `${cleanUrl}/storage/v1/object/public/${bucketName}/${filename}`;
          return NextResponse.json({ url: publicUrl });
        } else {
          const errorMsg = await response.text();
          console.error("Supabase storage upload failed, status:", response.status, errorMsg);
          // Fall back to local storage
        }
      } catch (err) {
        console.error("Error uploading to Supabase, falling back to local:", err);
      }
    }

    // 2. Local fallback storage
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const relativeUrl = `/uploads/${filename}`;
    return NextResponse.json({ url: relativeUrl });
  } catch (err) {
    console.error("Upload handler failed:", err);
    return NextResponse.json({ error: "Upload failed: " + err.message }, { status: 500 });
  }
}
