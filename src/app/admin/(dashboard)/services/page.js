"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminServicesPage() {
  const [services, setServices] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/services")
      .then((r) => r.json())
      .then(setServices)
      .catch(() => setError("Could not load services. Is the database connected?"));
  }, []);

  async function handleDelete(id) {
    if (!confirm("Delete this service? This cannot be undone.")) return;
    await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
    setServices((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl text-cream">Poojas / Services</h1>
        <Link
          href="/admin/services/new"
          className="bg-sindoor hover:bg-sindoor-light text-cream text-sm font-semibold px-4 py-2 rounded-md"
        >
          + Add Service
        </Link>
      </div>

      {error && <p className="text-sindoor-light mb-4">{error}</p>}

      {!services ? (
        <p className="text-cream-dim">Loading…</p>
      ) : services.length === 0 ? (
        <p className="text-cream-dim">No services added yet. Click "Add Service" to create the first one.</p>
      ) : (
        <div className="border border-ink-3 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-ink-2 text-cream-dim text-left">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Active</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id} className="border-t border-ink-3">
                  <td className="p-3 text-cream">{s.nameEn}</td>
                  <td className="p-3 text-cream-dim">{s.category}</td>
                  <td className="p-3 text-cream-dim">
                    {s.priceNote || (s.price ? `₹${s.price}` : "—")}
                  </td>
                  <td className="p-3">{s.isActive ? "✅" : "—"}</td>
                  <td className="p-3 text-right space-x-3">
                    <Link href={`/admin/services/${s.id}`} className="text-brass hover:underline">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(s.id)} className="text-sindoor-light hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
