"use client";

import { useEffect, useState } from "react";

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState(null);
  const [form, setForm] = useState({ customerName: "", city: "", textEn: "", rating: 5 });

  function load() {
    fetch("/api/admin/testimonials").then((r) => r.json()).then(setItems);
  }
  useEffect(load, []);

  async function handleSubmit(e) {
    e.preventDefault();
    await fetch("/api/admin/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, isApproved: true }),
    });
    setForm({ customerName: "", city: "", textEn: "", rating: 5 });
    load();
  }

  async function toggleApprove(id, current) {
    await fetch(`/api/admin/testimonials/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isApproved: !current }),
    });
    load();
  }

  async function handleDelete(id) {
    await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl text-cream mb-6">Testimonials</h1>

      <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4 max-w-2xl mb-8 plaque p-5 relative">
        <div className="relative z-10 col-span-full grid sm:grid-cols-2 gap-4">
          <input
            required
            placeholder="Customer name"
            value={form.customerName}
            onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
            className="input"
          />
          <input
            placeholder="City"
            value={form.city}
            onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
            className="input"
          />
          <textarea
            required
            placeholder="Testimonial text"
            className="input sm:col-span-2"
            rows={3}
            value={form.textEn}
            onChange={(e) => setForm((f) => ({ ...f, textEn: e.target.value }))}
          />
          <button type="submit" className="sm:col-span-2 bg-sindoor hover:bg-sindoor-light text-cream font-semibold px-6 py-2.5 rounded-md">
            + Add Testimonial
          </button>
        </div>
      </form>

      {items && (
        <div className="space-y-3">
          {items.map((t) => (
            <div key={t.id} className="border border-ink-3 rounded-md p-4 flex justify-between items-start gap-4">
              <div>
                <div className="text-cream font-semibold">{t.customerName} {t.city ? `· ${t.city}` : ""}</div>
                <p className="text-cream-dim text-sm italic">"{t.textEn}"</p>
              </div>
              <div className="flex gap-3 shrink-0 text-sm">
                <button onClick={() => toggleApprove(t.id, t.isApproved)} className="text-brass hover:underline">
                  {t.isApproved ? "Unpublish" : "Publish"}
                </button>
                <button onClick={() => handleDelete(t.id)} className="text-sindoor-light hover:underline">
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
