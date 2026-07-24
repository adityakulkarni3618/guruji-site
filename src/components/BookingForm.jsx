"use client";

import { useState } from "react";

export default function BookingForm({ dict, services, preselectedService }) {
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    serviceSlug: preselectedService || "",
    date: "",
    time: "",
    notes: "",
  });

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="plaque p-8 text-center">
        <h2 className="text-brass text-xl mb-3 relative z-10">{dict.booking.successTitle}</h2>
        <p className="text-cream/90 mb-6 relative z-10">{dict.booking.successBody}</p>
        <div className="flex justify-center gap-4 relative z-10">
          <a
            href="tel:+919823324839"
            className="border border-brass text-brass hover:bg-brass hover:text-ink font-semibold px-5 py-2.5 rounded-md transition-colors"
          >
            {dict.booking.call}: +91 98233 24839
          </a>
          <a
            href="https://wa.me/919823324839"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] text-ink font-semibold px-5 py-2.5 rounded-md"
          >
            {dict.booking.whatsapp}
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label={dict.booking.name} required>
        <input
          required
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          className="input"
        />
      </Field>
      <Field label={dict.booking.phone} required>
        <input
          required
          type="tel"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          className="input"
        />
      </Field>
      <Field label={dict.booking.email}>
        <input
          type="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          className="input"
        />
      </Field>
      <Field label={dict.booking.city}>
        <input value={form.city} onChange={(e) => update("city", e.target.value)} className="input" />
      </Field>
      <Field label={dict.booking.service}>
        <select
          value={form.serviceSlug}
          onChange={(e) => update("serviceSlug", e.target.value)}
          className="input"
        >
          <option value="">—</option>
          {services.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.label}
            </option>
          ))}
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label={dict.booking.date}>
          <input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} className="input" />
        </Field>
        <Field label={dict.booking.time}>
          <input type="time" value={form.time} onChange={(e) => update("time", e.target.value)} className="input" />
        </Field>
      </div>
      <Field label={dict.booking.notes}>
        <textarea
          rows={3}
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
          className="input"
        />
      </Field>

      {status === "error" && (
        <p className="text-sindoor-light text-sm">Something went wrong — please try again or contact directly.</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full bg-sindoor hover:bg-sindoor-light text-cream font-semibold px-6 py-3 rounded-md transition-colors disabled:opacity-60"
      >
        {status === "submitting" ? "…" : dict.booking.submit}
      </button>

      <style jsx global>{`
        .input {
          width: 100%;
          background: var(--color-ink-2);
          border: 1px solid var(--color-ink-3);
          color: var(--color-cream);
          border-radius: 0.375rem;
          padding: 0.6rem 0.75rem;
          font-size: 0.9rem;
        }
        .input:focus {
          outline: 2px solid var(--color-brass);
          outline-offset: 1px;
        }
      `}</style>
    </form>
  );
}

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="block text-sm text-cream-dim mb-1">
        {label} {required && <span className="text-sindoor-light">*</span>}
      </span>
      {children}
    </label>
  );
}
