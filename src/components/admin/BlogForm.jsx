"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAdminDict } from "@/lib/adminLang";

const LANGS = [
  { key: "En", label: "English" },
  { key: "Hi", label: "हिंदी" },
  { key: "Mr", label: "मराठी" },
];

export default function BlogForm({ initial, postId }) {
  const router = useRouter();
  const [activeLang, setActiveLang] = useState("En");
  const [saving, setSaving] = useState(false);
  const [dict, setDict] = useState(getAdminDict());

  useEffect(() => {
    setDict(getAdminDict());
    const handleLangChange = () => setDict(getAdminDict());
    window.addEventListener("admin-lang-change", handleLangChange);
    return () => window.removeEventListener("admin-lang-change", handleLangChange);
  }, []);

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
        <span className="block text-sm text-cream-dim mb-1">{dict.admin.slugBlog}</span>
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
        <span className="block text-sm text-cream-dim mb-1">{dict.admin.titleLabel} ({activeLang})</span>
        <input
          value={form[`title${activeLang}`] || ""}
          onChange={(e) => update(`title${activeLang}`, e.target.value)}
          className="input"
        />
      </label>
      <label className="block">
        <span className="block text-sm text-cream-dim mb-1">{dict.admin.bodyLabel} ({activeLang})</span>
        <textarea
          rows={10}
          value={form[`body${activeLang}`] || ""}
          onChange={(e) => update(`body${activeLang}`, e.target.value)}
          className="input"
        />
      </label>

      <label className="block">
        <span className="block text-sm text-cream-dim mb-1">{dict.admin.coverImageLabel}</span>
        <input value={form.coverImageUrl || ""} onChange={(e) => update("coverImageUrl", e.target.value)} className="input" />
        <FileUploadHelper
          onUploadComplete={(url) => update("coverImageUrl", url)}
          accept="image/*"
        />
      </label>

      <label className="flex items-center gap-2 text-sm text-cream-dim cursor-pointer select-none">
        <input type="checkbox" checked={form.isPublished} onChange={(e) => update("isPublished", e.target.checked)} />
        {dict.admin.publishedLabel}
      </label>

      <button type="submit" disabled={saving} className="bg-sindoor hover:bg-sindoor-light text-cream font-semibold px-6 py-2.5 rounded-md disabled:opacity-60 cursor-pointer select-none">
        {saving ? dict.admin.saving : postId ? dict.admin.save : dict.admin.createArticle}
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
        throw new Error("Upload failed");
      }

      const data = await res.json();
      onUploadComplete(data.url);
    } catch (err) {
      setError("Failed to upload file");
      console.error(err);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="mt-1.5">
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
