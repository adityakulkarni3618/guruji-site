"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAdminDict } from "@/lib/adminLang";

const CATEGORIES = ["pooja", "vastu", "jyotish", "gemstone", "muhurat", "reiki", "other"];
const LANGS = [
  { key: "En", label: "English" },
  { key: "Hi", label: "हिंदी" },
  { key: "Mr", label: "मराठी" },
];

export default function ServiceForm({ initial, serviceId }) {
  const router = useRouter();
  const [activeLang, setActiveLang] = useState("En");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [dict, setDict] = useState(getAdminDict());

  useEffect(() => {
    setDict(getAdminDict());
    const handleLangChange = () => setDict(getAdminDict());
    window.addEventListener("admin-lang-change", handleLangChange);
    return () => window.removeEventListener("admin-lang-change", handleLangChange);
  }, []);

  const [form, setForm] = useState(
    initial || {
      slug: "",
      category: "pooja",
      nameEn: "",
      nameHi: "",
      nameMr: "",
      shortDescEn: "",
      shortDescHi: "",
      shortDescMr: "",
      descriptionEn: "",
      descriptionHi: "",
      descriptionMr: "",
      samagri: [],
      durationMinutes: "",
      price: "",
      priceNote: "",
      imageUrl: "",
      pdfUrl: "",
      aartiEn: "",
      aartiHi: "",
      aartiMr: "",
      isActive: true,
    }
  );

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function updateSamagri(index, field, value) {
    setForm((f) => {
      const list = [...f.samagri];
      list[index] = { ...list[index], [field]: value };
      return { ...f, samagri: list };
    });
  }

  function addSamagriRow() {
    setForm((f) => ({ ...f, samagri: [...f.samagri, { itemEn: "", itemHi: "", itemMr: "", qty: "" }] }));
  }

  function removeSamagriRow(index) {
    setForm((f) => ({ ...f, samagri: f.samagri.filter((_, i) => i !== index) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const url = serviceId ? `/api/admin/services/${serviceId}` : "/api/admin/services";
      const method = serviceId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          durationMinutes: form.durationMinutes ? Number(form.durationMinutes) : null,
          price: form.price ? Number(form.price) : null,
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      router.push("/admin/services");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl text-cream mb-6 select-none font-display">
        {serviceId ? dict.admin.editServiceHeader : dict.admin.addServiceHeader}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        {error && <p className="text-sindoor-light">{error}</p>}

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label={dict.admin.slug}>
            <input required value={form.slug} onChange={(e) => update("slug", e.target.value)} className="input" />
          </Field>
          <Field label={dict.admin.categoryLabel}>
            <select value={form.category} onChange={(e) => update("category", e.target.value)} className="input">
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
        </div>

        {/* Language tabs for name/short description/full description */}
        <div>
          <div className="flex gap-2 mb-3">
            {LANGS.map((l) => (
              <button
                type="button"
                key={l.key}
                onClick={() => setActiveLang(l.key)}
                className={`px-3 py-1.5 rounded-md text-sm border ${
                  activeLang === l.key ? "bg-brass text-ink border-brass" : "border-ink-3 text-cream-dim"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <Field label={`${dict.admin.formName} (${activeLang === "En" ? "English" : activeLang === "Hi" ? "हिंदी" : "मराठी"})${activeLang === "En" ? " *" : ""}`}>
              <input
                required={activeLang === "En"}
                value={form[`name${activeLang}`] || ""}
                onChange={(e) => update(`name${activeLang}`, e.target.value)}
                className="input"
              />
            </Field>
            <Field label={`${dict.admin.formShortDesc} (${activeLang === "En" ? "English" : activeLang === "Hi" ? "हिंदी" : "मराठी"})`}>
              <input
                value={form[`shortDesc${activeLang}`] || ""}
                onChange={(e) => update(`shortDesc${activeLang}`, e.target.value)}
                className="input"
              />
            </Field>
            <Field label={`${dict.admin.formDesc} (${activeLang === "En" ? "English" : activeLang === "Hi" ? "हिंदी" : "मराठी"})`}>
              <textarea
                rows={4}
                value={form[`description${activeLang}`] || ""}
                onChange={(e) => update(`description${activeLang}`, e.target.value)}
                className="input"
              />
            </Field>
            <Field label={`${dict.admin.formAarti} (${activeLang === "En" ? "English" : activeLang === "Hi" ? "हिंदी" : "मराठी"})`}>
              <textarea
                rows={6}
                placeholder={dict.admin.aartiPlaceholder}
                value={form[`aarti${activeLang}`] || ""}
                onChange={(e) => update(`aarti${activeLang}`, e.target.value)}
                className="input"
              />
            </Field>
          </div>
        </div>

      {/* Samagri list */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-cream-dim">{dict.admin.samagriLabel}</span>
          <button type="button" onClick={addSamagriRow} className="text-brass text-sm hover:underline">
            {dict.admin.addItem}
          </button>
        </div>
        <div className="space-y-2">
          {form.samagri.map((item, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_1fr_80px_32px] gap-2">
              <input
                placeholder={dict.admin.itemEnglish}
                value={item.itemEn || ""}
                onChange={(e) => updateSamagri(i, "itemEn", e.target.value)}
                className="input"
              />
              <input
                placeholder={dict.admin.itemHindi}
                value={item.itemHi || ""}
                onChange={(e) => updateSamagri(i, "itemHi", e.target.value)}
                className="input"
              />
              <input
                placeholder={dict.admin.itemMarathi}
                value={item.itemMr || ""}
                onChange={(e) => updateSamagri(i, "itemMr", e.target.value)}
                className="input"
              />
              <input
                placeholder={dict.admin.qty}
                value={item.qty || ""}
                onChange={(e) => updateSamagri(i, "qty", e.target.value)}
                className="input"
              />
              <button
                type="button"
                onClick={() => removeSamagriRow(i)}
                className="text-sindoor-light font-bold"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Field label={dict.admin.durationLabel}>
          <input
            type="number"
            value={form.durationMinutes || ""}
            onChange={(e) => update("durationMinutes", e.target.value)}
            className="input"
          />
        </Field>
        <Field label={dict.admin.priceLabel}>
          <input
            type="number"
            value={form.price || ""}
            onChange={(e) => update("price", e.target.value)}
            className="input"
          />
        </Field>
        <Field label={dict.admin.priceNoteLabel}>
          <input
            value={form.priceNote || ""}
            onChange={(e) => update("priceNote", e.target.value)}
            className="input"
          />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label={dict.admin.imageUrlLabel}>
          <input value={form.imageUrl || ""} onChange={(e) => update("imageUrl", e.target.value)} className="input" />
          <FileUploadHelper
            onUploadComplete={(url) => update("imageUrl", url)}
            accept="image/*"
          />
        </Field>
        <Field label={dict.admin.pdfUrlLabel}>
          <input
            value={form.pdfUrl || ""}
            onChange={(e) => update("pdfUrl", e.target.value)}
            className="input"
            placeholder="e.g. Google Drive link to PDF"
          />
          <FileUploadHelper
            onUploadComplete={(url) => update("pdfUrl", url)}
            accept="application/pdf,image/*"
          />
        </Field>
      </div>

      <label className="flex items-center gap-2 text-sm text-cream-dim select-none cursor-pointer">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(e) => update("isActive", e.target.checked)}
        />
        {dict.admin.visibleLabel}
      </label>

      <button
        type="submit"
        disabled={saving}
        className="bg-sindoor hover:bg-sindoor-light text-cream font-semibold px-6 py-2.5 rounded-md disabled:opacity-60 cursor-pointer select-none"
      >
        {saving ? dict.admin.saving : serviceId ? dict.admin.save : dict.admin.createService}
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
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-sm text-cream-dim mb-1">{label}</span>
      {children}
    </label>
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

