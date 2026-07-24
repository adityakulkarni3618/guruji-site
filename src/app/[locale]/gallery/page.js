import { getDictionary } from "@/i18n/dictionaries";

async function getGallery() {
  try {
    const { db } = await import("@/db");
    const { galleryItems } = await import("@/db/schema");
    return await db.select().from(galleryItems);
  } catch {
    return [];
  }
}

export default async function GalleryPage({ params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const items = await getGallery();

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <h1 className="text-3xl md:text-4xl text-cream mb-8">{dict.nav.gallery}</h1>

      {items.length === 0 ? (
        <p className="text-cream-dim">
          Gallery photos and videos from Guruji's poojas will appear here — add them from the
          admin panel.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="rounded-lg overflow-hidden border border-ink-3">
              {item.mediaType === "video" ? (
                <video src={item.url} controls className="w-full aspect-video object-cover" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.url} alt={item.captionEn || ""} className="w-full aspect-video object-cover" />
              )}
              {item.captionEn && <div className="p-2 text-sm text-cream-dim">{item.captionEn}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
