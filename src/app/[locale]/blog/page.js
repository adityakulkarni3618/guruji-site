import Link from "next/link";
import { getDictionary } from "@/i18n/dictionaries";

async function getPosts() {
  try {
    const { db } = await import("@/db");
    const { blogPosts } = await import("@/db/schema");
    const rows = await db.select().from(blogPosts);
    return rows.filter((p) => p.isPublished);
  } catch {
    return [];
  }
}

function pick(post, field, locale) {
  const key = locale === "en" ? `${field}En` : locale === "hi" ? `${field}Hi` : `${field}Mr`;
  return post[key] || post[`${field}En`] || "";
}

export default async function BlogPage({ params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const posts = await getPosts();
  const base = `/${locale}`;

  return (
    <div className="max-w-4xl mx-auto px-6 py-14">
      <h1 className="text-3xl md:text-4xl text-cream mb-8">{dict.nav.blog}</h1>

      {posts.length === 0 ? (
        <p className="text-cream-dim">
          Articles on panchang, muhurat, vastu tips, and festivals will be published here.
        </p>
      ) : (
        <div className="space-y-6">
          {posts.map((p) => (
            <Link
              key={p.id}
              href={`${base}/blog/${p.slug}`}
              className="block bg-ink-2 border border-ink-3 hover:border-brass rounded-lg p-5"
            >
              <h2 className="text-xl text-cream mb-2">{pick(p, "title", locale)}</h2>
              <span className="text-brass text-sm">{dict.common.readMore} →</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
