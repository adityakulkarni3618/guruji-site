import { getDictionary } from "@/i18n/dictionaries";
import GalleryPage from "./page";

async function getGallery() {
  try {
    const { db } = await import("@/db");
    const { galleryItems } = await import("@/db/schema");
    return await db.select().from(galleryItems);
  } catch {
    return [];
  }
}

export default async function GalleryServerPage({ params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const items = await getGallery();
  return <GalleryPage dict={dict} items={items} />;
}
