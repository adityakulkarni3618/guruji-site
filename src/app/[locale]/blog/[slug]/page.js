import { notFound } from "next/navigation";

async function getPost(slug) {
  try {
    const { db } = await import("@/db");
    const { blogPosts } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");
    const rows = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
    return rows[0] || null;
  } catch {
    return null;
  }
}

function pick(post, field, locale) {
  const key = locale === "en" ? `${field}En` : locale === "hi" ? `${field}Hi` : `${field}Mr`;
  return post[key] || post[`${field}En`] || "";
}

export default async function BlogDetailPage({ params }) {
  const { locale, slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <article className="max-w-3xl mx-auto px-6 py-14">
      <h1 className="text-3xl md:text-4xl text-cream mb-6">{pick(post, "title", locale)}</h1>
      <div className="text-cream/90 leading-relaxed whitespace-pre-line">
        {pick(post, "body", locale)}
      </div>
    </article>
  );
}
