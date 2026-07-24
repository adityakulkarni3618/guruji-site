"use client";

import { useEffect, useState } from "react";

export default function AdminGalleryPage() {
  const [items, setItems] = useState(null);
  const [form, setForm] = useState({ mediaType: "image", url: "", captionEn: "" });

  function load() {
    fetch("/api/admin/gallery").then((r) => r.json()).then(setItems);
  }
  useEffect(load, []);

  async function handleSubmit(e) {
    e.preventDefault();
    await fetch("/api/admin/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ mediaType: "image", url: "", captionEn: "" });
    load();
  }

  async function handleDelete(id) {
    await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl text-cream mb-2">Gallery</h1>
      <p className="text-cream-dim text-sm mb-6">
        Paste a photo or video URL (e.g. from Google Drive, Google Photos share link, or any
        image host). For a private, permanent media library, connect Supabase Storage — see
        README.
      </p>

      <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4 max-w-2xl mb-8 plaque p-5 relative">
        <div className="relative z-10 col-span-full grid sm:grid-cols-2 gap-4">
          <select
            value={form.mediaType}
            onChange={(e) => setForm((f) => ({ ...f, mediaType: e.target.value }))}
            className="input"
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
          <input
            required
            placeholder="Media URL"
            value={form.url}
            onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
            className="input"
          />
          <input
            placeholder="Caption (optional)"
            className="input sm:col-span-2"
            value={form.captionEn}
            onChange={(e) => setForm((f) => ({ ...f, captionEn: e.target.value }))}
          />
          <button type="submit" className="sm:col-span-2 bg-sindoor hover:bg-sindoor-light text-cream font-semibold px-6 py-2.5 rounded-md">
            + Add to Gallery
          </button>
        </div>
      </form>

      {items && (
        <div className="grid sm:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="border border-ink-3 rounded-md overflow-hidden">
              {item.mediaType === "video" ? (
                <video src={item.url} className="w-full aspect-video object-cover" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.url} alt="" className="w-full aspect-video object-cover" />
              )}
              <div className="p-2 flex justify-between items-center text-sm">
                <span className="text-cream-dim truncate">{item.captionEn}</span>
                <button onClick={() => handleDelete(item.id)} className="text-sindoor-light shrink-0 ml-2">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx global>{`
        .input {
          width: 100%;
          background: var(--color-ink-2);
          border: 1px solid var(--color-ink-3);
          color: var(--color-cream);
          border-radius: 0.375rem;
          padding: 0.55rem 0.7rem;
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
}
