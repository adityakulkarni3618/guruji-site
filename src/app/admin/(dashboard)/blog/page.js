"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState(null);

  function load() {
    fetch("/api/admin/blog").then((r) => r.json()).then(setPosts);
  }
  useEffect(load, []);

  async function handleDelete(id) {
    if (!confirm("Delete this article?")) return;
    await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl text-cream">Articles</h1>
        <Link href="/admin/blog/new" className="bg-sindoor hover:bg-sindoor-light text-cream text-sm font-semibold px-4 py-2 rounded-md">
          + New Article
        </Link>
      </div>

      {posts && (
        <div className="space-y-2">
          {posts.map((p) => (
            <div key={p.id} className="flex items-center justify-between border border-ink-3 rounded-md p-3">
              <div>
                <div className="text-cream">{p.titleEn}</div>
                <div className="text-cream-dim text-xs">{p.isPublished ? "Published" : "Draft"}</div>
              </div>
              <div className="flex gap-3 text-sm">
                <Link href={`/admin/blog/${p.id}`} className="text-brass hover:underline">Edit</Link>
                <button onClick={() => handleDelete(p.id)} className="text-sindoor-light hover:underline">Delete</button>
              </div>
            </div>
          ))}
          {posts.length === 0 && <p className="text-cream-dim">No articles yet.</p>}
        </div>
      )}
    </div>
  );
}
