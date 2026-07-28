import { getDictionary } from "@/i18n/dictionaries";
import GalleryGrid from "@/components/GalleryGrid";

async function getGallery() {
  try {
    const { db } = await import("@/db");
    const { galleryItems } = await import("@/db/schema");
    const { desc } = await import("drizzle-orm");
    return await db.select().from(galleryItems).orderBy(desc(galleryItems.createdAt));
  } catch (err) {
    console.error("Failed to load gallery items:", err);
    return [];
  }
}

export default async function GalleryPage({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || "en";
  const dict = getDictionary(locale);
  const items = await getGallery();

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <h1 className="text-3xl md:text-4xl text-cream mb-8">{dict.nav.gallery}</h1>

      {items.length === 0 ? (
        <p className="text-cream-dim">
          Gallery photos and videos from Guruji&apos;s poojas will appear here — add them from the
          admin panel.
        </p>
      ) : (
        <GalleryGrid items={items} />
      )}
    </div>
  );
}
