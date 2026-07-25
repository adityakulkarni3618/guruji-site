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
            onChange={(e) => setForm((f) => ({ ...f, mediaType: e.target.value, url: "" }))}
            className="input"
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
          <div className="flex flex-col gap-1.5">
            <input
              placeholder="Media URL"
              value={form.url}
              onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
              className="input"
            />
            <FileUploadHelper
              onUploadComplete={(url) => setForm((f) => ({ ...f, url }))}
              accept={form.mediaType === "video" ? "video/*" : "image/*"}
            />
          </div>
          <input
            placeholder="Caption (optional)"
            className="input sm:col-span-2"
            value={form.captionEn}
            onChange={(e) => setForm((f) => ({ ...f, captionEn: e.target.value }))}
          />
          <button type="submit" className="sm:col-span-2 bg-sindoor hover:bg-sindoor-light text-cream font-semibold px-6 py-2.5 rounded-md cursor-pointer select-none">
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

function FileUploadHelper({ onUploadComplete, accept = "image/*" }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await res.json();
      onUploadComplete(data.url);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="mt-1">
      <label className="bg-ink-3 hover:bg-ink border border-ink-3 hover:border-brass/35 text-brass text-xs font-semibold px-3 py-1.5 rounded cursor-pointer transition-all inline-flex items-center gap-1.5 select-none">
        {uploading ? (
          <>
            <svg className="animate-spin h-3.5 w-3.5 text-brass" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Uploading...
          </>
        ) : (
          "📁 Upload File"
        )}
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />
      </label>
      {error && <div className="text-[11px] text-sindoor-light mt-1">{error}</div>}
    </div>
  );
}

