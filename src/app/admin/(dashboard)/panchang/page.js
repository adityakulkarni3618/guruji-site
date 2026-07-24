"use client";

import { useEffect, useState } from "react";

const FIELDS = [
  ["tithi", "Tithi"],
  ["paksha", "Paksha (Shukla/Krishna)"],
  ["nakshatra", "Nakshatra"],
  ["yoga", "Yoga"],
  ["karan", "Karan"],
  ["sunrise", "Sunrise (HH:MM)"],
  ["sunset", "Sunset (HH:MM)"],
  ["rahuKaalStart", "Rahu Kaal Start"],
  ["rahuKaalEnd", "Rahu Kaal End"],
  ["gulikaKaalStart", "Gulika Kaal Start"],
  ["gulikaKaalEnd", "Gulika Kaal End"],
];

export default function AdminPanchangPage() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/panchang?date=${date}`)
      .then((r) => r.json())
      .then((data) => setForm({ ...data, entryDate: date }));
  }, [date]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/admin/panchang", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
  }

  return (
    <div>
      <h1 className="text-2xl text-cream mb-2">Daily Panchang Override</h1>
      <p className="text-cream-dim text-sm mb-6">
        Panchang is calculated automatically every day. Use this only if you need to correct or
        adjust a specific date.
      </p>

      <label className="block mb-6 max-w-xs">
        <span className="block text-sm text-cream-dim mb-1">Date</span>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input"
        />
      </label>

      <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4 max-w-2xl">
        {FIELDS.map(([key, label]) => (
          <label key={key} className="block">
            <span className="block text-sm text-cream-dim mb-1">{label}</span>
            <input
              value={form[key] || ""}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              className="input"
            />
          </label>
        ))}

        <button
          type="submit"
          disabled={saving}
          className="sm:col-span-2 bg-sindoor hover:bg-sindoor-light text-cream font-semibold px-6 py-2.5 rounded-md disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Override"}
        </button>
      </form>

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
