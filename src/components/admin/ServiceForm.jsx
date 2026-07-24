"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {error && <p className="text-sindoor-light">{error}</p>}

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Slug (URL, e.g. vastu-shanti)">
          <input required value={form.slug} onChange={(e) => update("slug", e.target.value)} className="input" />
        </Field>
        <Field label="Category">
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
          <Field label={`Name (${activeLang})${activeLang === "En" ? " *" : ""}`}>
            <input
              required={activeLang === "En"}
              value={form[`name${activeLang}`] || ""}
              onChange={(e) => update(`name${activeLang}`, e.target.value)}
              className="input"
            />
          </Field>
          <Field label={`Short Description (${activeLang})`}>
            <input
              value={form[`shortDesc${activeLang}`] || ""}
              onChange={(e) => update(`shortDesc${activeLang}`, e.target.value)}
              className="input"
            />
          </Field>
          <Field label={`Full Description (${activeLang})`}>
            <textarea
              rows={4}
              value={form[`description${activeLang}`] || ""}
              onChange={(e) => update(`description${activeLang}`, e.target.value)}
              className="input"
            />
          </Field>
        </div>
      </div>

      {/* Samagri list */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-cream-dim">Samagri Required</span>
          <button type="button" onClick={addSamagriRow} className="text-brass text-sm hover:underline">
            + Add Item
          </button>
        </div>
        <div className="space-y-2">
          {form.samagri.map((item, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_1fr_80px_32px] gap-2">
              <input
                placeholder="Item (English)"
                value={item.itemEn || ""}
                onChange={(e) => updateSamagri(i, "itemEn", e.target.value)}
                className="input"
              />
              <input
                placeholder="Item (हिंदी)"
                value={item.itemHi || ""}
                onChange={(e) => updateSamagri(i, "itemHi", e.target.value)}
                className="input"
              />
              <input
                placeholder="Item (मराठी)"
                value={item.itemMr || ""}
                onChange={(e) => updateSamagri(i, "itemMr", e.target.value)}
                className="input"
              />
              <input
                placeholder="Qty"
                value={item.qty || ""}
                onChange={(e) => updateSamagri(i, "qty", e.target.value)}
                className="input"
              />
              <button
                type="button"
                onClick={() => removeSamagriRow(i)}
                className="text-sindoor-light"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="Duration (minutes)">
          <input
            type="number"
            value={form.durationMinutes || ""}
            onChange={(e) => update("durationMinutes", e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Price (₹, optional)">
          <input
            type="number"
            value={form.price || ""}
            onChange={(e) => update("price", e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Price Note (optional, e.g. 'Contact for pricing')">
          <input
            value={form.priceNote || ""}
            onChange={(e) => update("priceNote", e.target.value)}
            className="input"
          />
        </Field>
      </div>

      <Field label="Image URL (optional)">
        <input value={form.imageUrl || ""} onChange={(e) => update("imageUrl", e.target.value)} className="input" />
      </Field>

      <label className="flex items-center gap-2 text-sm text-cream-dim">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(e) => update("isActive", e.target.checked)}
        />
        Visible on website
      </label>

      <button
        type="submit"
        disabled={saving}
        className="bg-sindoor hover:bg-sindoor-light text-cream font-semibold px-6 py-2.5 rounded-md disabled:opacity-60"
      >
        {saving ? "Saving…" : serviceId ? "Save Changes" : "Create Service"}
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

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-sm text-cream-dim mb-1">{label}</span>
      {children}
    </label>
  );
}
