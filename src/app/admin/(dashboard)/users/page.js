"use client";

import { useEffect, useState } from "react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "assistant" });
  const [error, setError] = useState("");

  function load() {
    fetch("/api/admin/users").then((r) => r.json()).then(setUsers);
  }
  useEffect(load, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      return;
    }
    setForm({ name: "", email: "", password: "", role: "assistant" });
    load();
  }

  async function handleDelete(id) {
    if (!confirm("Remove this admin user?")) return;
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl text-cream mb-6">Admin Users</h1>
      <p className="text-cream-dim text-sm mb-6">
        Add a login for Guruji's assistant here. Anyone added can access the full admin panel.
      </p>

      <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4 max-w-2xl mb-8 plaque p-5 relative">
        <div className="relative z-10 col-span-full grid sm:grid-cols-2 gap-4">
          <input required placeholder="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input" />
          <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="input" />
          <input required type="password" placeholder="Password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} className="input" />
          <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} className="input">
            <option value="assistant">Assistant</option>
            <option value="owner">Owner</option>
          </select>
          {error && <p className="text-sindoor-light text-sm col-span-full">{error}</p>}
          <button type="submit" className="sm:col-span-2 bg-sindoor hover:bg-sindoor-light text-cream font-semibold px-6 py-2.5 rounded-md">
            + Add Admin User
          </button>
        </div>
      </form>

      {users && (
        <div className="space-y-2">
          {users.map((u) => (
            <div key={u.id} className="flex justify-between items-center border border-ink-3 rounded-md p-3">
              <div>
                <div className="text-cream">{u.name} <span className="text-cream-dim text-xs">({u.role})</span></div>
                <div className="text-cream-dim text-xs">{u.email}</div>
              </div>
              <button onClick={() => handleDelete(u.id)} className="text-sindoor-light text-sm hover:underline">
                Remove
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
