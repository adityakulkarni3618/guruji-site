"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [status, setStatus] = useState("idle");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="plaque p-6 relative">
        <p className="text-cream/90 relative z-10">Thank you — your message has been sent.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        required
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        className="w-full bg-ink-2 border border-ink-3 text-cream rounded-md px-3 py-2.5 text-sm"
      />
      <input
        required
        placeholder="Phone"
        value={form.phone}
        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
        className="w-full bg-ink-2 border border-ink-3 text-cream rounded-md px-3 py-2.5 text-sm"
      />
      <input
        type="email"
        placeholder="Email (optional)"
        value={form.email}
        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        className="w-full bg-ink-2 border border-ink-3 text-cream rounded-md px-3 py-2.5 text-sm"
      />
      <textarea
        required
        rows={4}
        placeholder="Message"
        value={form.message}
        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
        className="w-full bg-ink-2 border border-ink-3 text-cream rounded-md px-3 py-2.5 text-sm"
      />
      {status === "error" && <p className="text-sindoor-light text-sm">Something went wrong, please try again.</p>}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full bg-sindoor hover:bg-sindoor-light text-cream font-semibold px-6 py-3 rounded-md transition-colors disabled:opacity-60"
      >
        {status === "submitting" ? "…" : "Send Message"}
      </button>
    </form>
  );
}
