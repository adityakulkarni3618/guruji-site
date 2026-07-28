import { getDictionary } from "@/i18n/dictionaries";
import GalleryPage from "./page";

async function getGallery() {
  try {
    const { db } = await import("@/db");
    const { galleryItems } = await import("@/db/schema");
    const { desc } = await import("drizzle-orm");
    return await db.select().from(galleryItems).orderBy(desc(galleryItems.createdAt));
  } catch (err) {
    console.error("Failed to load gallery items in layout:", err);
    return [];
  }
}

export default async function GalleryServerPage({ params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const items = await getGallery();
  return <GalleryPage dict={dict} items={items} />;
}
