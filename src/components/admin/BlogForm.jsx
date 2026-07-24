"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const LANGS = [
  { key: "En", label: "English" },
  { key: "Hi", label: "हिंदी" },
  { key: "Mr", label: "मराठी" },
];

export default function BlogForm({ initial, postId }) {
  const router = useRouter();
  const [activeLang, setActiveLang] = useState("En");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(
    initial || { slug: "", titleEn: "", titleHi: "", titleMr: "", bodyEn: "", bodyHi: "", bodyMr: "", coverImageUrl: "", isPublished: false }
  );

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const url = postId ? `/api/admin/blog/${postId}` : "/api/admin/blog";
    const method = postId ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.push("/admin/blog");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl">
      <label className="block">
        <span className="block text-sm text-cream-dim mb-1">Slug (URL)</span>
        <input required value={form.slug} onChange={(e) => update("slug", e.target.value)} className="input" />
      </label>

      <div className="flex gap-2">
        {LANGS.map((l) => (
          <button
            type="button"
            key={l.key}
            onClick={() => setActiveLang(l.key)}
            className={`px-3 py-1.5 rounded-md text-sm border ${activeLang === l.key ? "bg-brass text-ink border-brass" : "border-ink-3 text-cream-dim"}`}
          >
            {l.label}
          </button>
        ))}
      </div>

      <label className="block">
        <span className="block text-sm text-cream-dim mb-1">Title ({activeLang})</span>
        <input
          value={form[`title${activeLang}`] || ""}
          onChange={(e) => update(`title${activeLang}`, e.target.value)}
          className="input"
        />
      </label>
      <label className="block">
        <span className="block text-sm text-cream-dim mb-1">Body ({activeLang})</span>
        <textarea
          rows={10}
          value={form[`body${activeLang}`] || ""}
          onChange={(e) => update(`body${activeLang}`, e.target.value)}
          className="input"
        />
      </label>

      <label className="block">
        <span className="block text-sm text-cream-dim mb-1">Cover Image URL</span>
        <input value={form.coverImageUrl || ""} onChange={(e) => update("coverImageUrl", e.target.value)} className="input" />
      </label>

      <label className="flex items-center gap-2 text-sm text-cream-dim">
        <input type="checkbox" checked={form.isPublished} onChange={(e) => update("isPublished", e.target.checked)} />
        Published (visible on site)
      </label>

      <button type="submit" disabled={saving} className="bg-sindoor hover:bg-sindoor-light text-cream font-semibold px-6 py-2.5 rounded-md disabled:opacity-60">
        {saving ? "Saving…" : postId ? "Save Changes" : "Create Article"}
      </button>

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
    </form>
  );
}
