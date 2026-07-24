"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      router.push("/admin");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink px-4">
      <form onSubmit={handleSubmit} className="plaque p-8 w-full max-w-sm relative">
        <div className="relative z-10">
          <h1 className="text-brass text-xl mb-1">Admin Panel</h1>
          <p className="text-cream-dim text-sm mb-6">Guruji Rahul Joshi — Site Management</p>

          <label className="block mb-3">
            <span className="block text-sm text-cream-dim mb-1">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-ink-2 border border-ink-3 text-cream rounded-md px-3 py-2.5 text-sm"
            />
          </label>
          <label className="block mb-4">
            <span className="block text-sm text-cream-dim mb-1">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-ink-2 border border-ink-3 text-cream rounded-md px-3 py-2.5 text-sm"
            />
          </label>

          {error && <p className="text-sindoor-light text-sm mb-4">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sindoor hover:bg-sindoor-light text-cream font-semibold px-6 py-2.5 rounded-md transition-colors disabled:opacity-60"
          >
            {loading ? "…" : "Log In"}
          </button>
        </div>
      </form>
    </div>
  );
}
