"use client";

import { useEffect, useState } from "react";

const EVENT_TYPES = ["vivah", "griha_pravesh", "vahan_kharedi", "namkaran", "other"];

export default function AdminMuhuratPage() {
  const [dates, setDates] = useState(null);
  const [form, setForm] = useState({ eventType: "vivah", eventDate: "", timeWindow: "", noteEn: "" });

  function load() {
    fetch("/api/admin/muhurat").then((r) => r.json()).then(setDates);
  }

  useEffect(load, []);

  async function handleSubmit(e) {
    e.preventDefault();
    await fetch("/api/admin/muhurat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ eventType: "vivah", eventDate: "", timeWindow: "", noteEn: "" });
    load();
  }

  async function handleDelete(id) {
    await fetch(`/api/admin/muhurat/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl text-cream mb-6">Muhurat Dates</h1>

      <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4 max-w-2xl mb-8 plaque p-5 relative">
        <div className="relative z-10 col-span-full grid sm:grid-cols-2 gap-4">
          <select
            value={form.eventType}
            onChange={(e) => setForm((f) => ({ ...f, eventType: e.target.value }))}
            className="input"
          >
            {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <input
            type="date"
            required
            value={form.eventDate}
            onChange={(e) => setForm((f) => ({ ...f, eventDate: e.target.value }))}
            className="input"
          />
          <input
            placeholder="Time window (e.g. 10:00 AM - 12:30 PM)"
            value={form.timeWindow}
            onChange={(e) => setForm((f) => ({ ...f, timeWindow: e.target.value }))}
            className="input"
          />
          <input
            placeholder="Note"
            value={form.noteEn}
            onChange={(e) => setForm((f) => ({ ...f, noteEn: e.target.value }))}
            className="input"
          />
          <button type="submit" className="sm:col-span-2 bg-sindoor hover:bg-sindoor-light text-cream font-semibold px-6 py-2.5 rounded-md">
            + Add Muhurat Date
          </button>
        </div>
      </form>

      {dates && (
        <div className="space-y-2">
          {dates.map((d) => (
            <div key={d.id} className="flex items-center justify-between border border-ink-3 rounded-md p-3">
              <div className="text-cream text-sm">
                {d.eventType} — {d.eventDate} {d.timeWindow ? `(${d.timeWindow})` : ""}
              </div>
              <button onClick={() => handleDelete(d.id)} className="text-sindoor-light text-sm hover:underline">
                Delete
              </button>
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
