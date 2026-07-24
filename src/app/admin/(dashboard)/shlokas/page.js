"use client";

import { useEffect, useState } from "react";

export default function AdminShlokasPage() {
  const [items, setItems] = useState(null);
  const [form, setForm] = useState({
    shloka: "",
    translationEn: "",
    translationHi: "",
    translationMr: "",
    displayDate: "",
  });
  const [editingId, setEditingId] = useState(null);

  function load() {
    fetch("/api/admin/shlokas")
      .then((r) => r.json())
      .then(setItems);
  }
  useEffect(load, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/admin/shlokas/${editingId}` : "/api/admin/shlokas";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({ shloka: "", translationEn: "", translationHi: "", translationMr: "", displayDate: "" });
    setEditingId(null);
    load();
  }

  function startEdit(item) {
    setEditingId(item.id);
    setForm({
      shloka: item.shloka,
      translationEn: item.translationEn || "",
      translationHi: item.translationHi || "",
      translationMr: item.translationMr || "",
      displayDate: item.displayDate || "",
    });
  }

  async function handleDelete(id) {
    if (confirm("Are you sure you want to delete this shloka?")) {
      await fetch(`/api/admin/shlokas/${id}`, { method: "DELETE" });
      load();
    }
  }

  return (
    <div>
      <h1 className="text-2xl text-cream mb-6">Daily Shlokas Manager</h1>

      <form onSubmit={handleSubmit} className="grid gap-4 max-w-3xl mb-8 plaque p-5 relative">
        <h2 className="text-brass text-lg font-semibold relative z-10">
          {editingId ? "Edit Shloka" : "Add New Shloka"}
        </h2>
        <div className="relative z-10 grid gap-4">
          <div>
            <label className="block text-xs text-cream-dim mb-1">Shloka (Sanskrit / Devanagari) *</label>
            <textarea
              required
              rows={3}
              placeholder="e.g. वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ..."
              value={form.shloka}
              onChange={(e) => setForm((f) => ({ ...f, shloka: e.target.value }))}
              className="input font-mono"
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-cream-dim mb-1">Marathi Translation</label>
              <textarea
                rows={3}
                placeholder="मराठी भाषांतर..."
                value={form.translationMr}
                onChange={(e) => setForm((f) => ({ ...f, translationMr: e.target.value }))}
                className="input"
              />
            </div>
            <div>
              <label className="block text-xs text-cream-dim mb-1">Hindi Translation</label>
              <textarea
                rows={3}
                placeholder="हिंदी अनुवाद..."
                value={form.translationHi}
                onChange={(e) => setForm((f) => ({ ...f, translationHi: e.target.value }))}
                className="input"
              />
            </div>
            <div>
              <label className="block text-xs text-cream-dim mb-1">English Translation</label>
              <textarea
                rows={3}
                placeholder="English translation..."
                value={form.translationEn}
                onChange={(e) => setForm((f) => ({ ...f, translationEn: e.target.value }))}
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-cream-dim mb-1">Display Date (Optional - e.g. YYYY-MM-DD to pin to a day)</label>
            <input
              type="date"
              value={form.displayDate}
              onChange={(e) => setForm((f) => ({ ...f, displayDate: e.target.value }))}
              className="input max-w-xs"
            />
          </div>

          <div className="flex gap-3">
            <button type="submit" className="bg-sindoor hover:bg-brass hover:text-ink text-cream font-semibold px-6 py-2.5 rounded-md transition-colors">
              {editingId ? "Update Shloka" : "+ Add Shloka"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({ shloka: "", translationEn: "", translationHi: "", translationMr: "", displayDate: "" });
                }}
                className="border border-ink-3 text-cream-dim hover:text-cream px-4 py-2.5 rounded-md"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      <h2 className="text-xl text-cream mb-4">Saved Shlokas</h2>
      {items && (
        <div className="space-y-4 max-w-3xl">
          {items.map((t) => (
            <div key={t.id} className="border border-ink-3 rounded-md p-5 flex justify-between items-start gap-4 bg-ink-2/30">
              <div className="space-y-2 flex-1">
                <div className="text-brass font-mono whitespace-pre-wrap font-semibold">{t.shloka}</div>
                {t.translationMr && (
                  <p className="text-cream/90 text-sm"><span className="text-cream-dim font-bold text-xs mr-1">[MR]:</span> {t.translationMr}</p>
                )}
                {t.translationHi && (
                  <p className="text-cream/90 text-sm"><span className="text-cream-dim font-bold text-xs mr-1">[HI]:</span> {t.translationHi}</p>
                )}
                {t.translationEn && (
                  <p className="text-cream/90 text-sm"><span className="text-cream-dim font-bold text-xs mr-1">[EN]:</span> {t.translationEn}</p>
                )}
                {t.displayDate && (
                  <div className="text-xs text-brass inline-block border border-brass/30 px-2 py-0.5 rounded">
                    Pinned Date: {t.displayDate}
                  </div>
                )}
              </div>
              <div className="flex gap-3 shrink-0 text-sm">
                <button onClick={() => startEdit(t)} className="text-brass hover:underline">
                  Edit
                </button>
                <button onClick={() => handleDelete(t.id)} className="text-sindoor-light hover:underline">
                  Delete
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-cream-dim italic text-sm">No shlokas added yet.</p>
          )}
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
        .input:focus {
          outline: 2px solid var(--color-brass);
          outline-offset: 1px;
        }
      `}</style>
    </div>
  );
}
