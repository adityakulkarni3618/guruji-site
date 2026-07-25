"use client";

import { useEffect, useState } from "react";

const STATUSES = ["pending", "confirmed", "completed", "cancelled"];
const ITEMS_PER_PAGE = 10;

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch("/api/admin/bookings").then((r) => r.json()).then(setBookings);
  }, []);

  async function updateStatus(id, status) {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    await fetch(`/api/admin/bookings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  // Reset page when search term changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  if (!bookings) {
    return <p className="text-cream-dim">Loading…</p>;
  }

  const filtered = bookings.filter((b) => {
    const term = search.toLowerCase();
    return (
      b.customerName?.toLowerCase().includes(term) ||
      b.customerPhone?.toLowerCase().includes(term) ||
      (b.city && b.city.toLowerCase().includes(term)) ||
      (b.serviceName && b.serviceName.toLowerCase().includes(term))
    );
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl text-cream">Bookings</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search bookings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-ink-2 border border-ink-3 text-cream rounded-md px-3 py-1.5 text-sm w-full md:w-64 focus:outline-none focus:border-brass"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-cream-dim">No booking requests found.</p>
      ) : (
        <div className="space-y-4">
          <div className="border border-ink-3 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-ink-2 text-cream-dim text-left">
                <tr>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Service</th>
                  <th className="p-3">Preferred Date</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((b) => (
                  <tr key={b.id} className="border-t border-ink-3 align-top hover:bg-ink-2/30 transition-colors">
                    <td className="p-3 text-cream">
                      <div className="font-medium">{b.customerName}</div>
                      {b.city ? <div className="text-cream-dim text-xs mt-0.5">{b.city}</div> : null}
                    </td>
                    <td className="p-3 text-cream-dim">
                      <a href={`tel:${b.customerPhone}`} className="hover:text-brass transition-colors">{b.customerPhone}</a>
                    </td>
                    <td className="p-3 text-cream-dim">{b.serviceName}</td>
                    <td className="p-3 text-cream-dim">
                      {b.preferredDate || "—"} {b.preferredTime || ""}
                    </td>
                    <td className="p-3">
                      <select
                        value={b.status}
                        onChange={(e) => updateStatus(b.id, e.target.value)}
                        className="bg-ink-2 border border-ink-3 text-cream rounded-md px-2 py-1 text-sm focus:outline-none focus:border-brass cursor-pointer"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-ink-3 pt-4">
              <span className="text-xs text-cream-dim">
                Showing {Math.min(filtered.length, (page - 1) * ITEMS_PER_PAGE + 1)} to{" "}
                {Math.min(filtered.length, page * ITEMS_PER_PAGE)} of {filtered.length} entries
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 text-xs bg-ink-2 border border-ink-3 rounded text-cream disabled:opacity-40 hover:border-brass transition-colors cursor-pointer"
                >
                  Previous
                </button>
                <span className="px-3 py-1 text-xs text-cream select-none font-medium">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 text-xs bg-ink-2 border border-ink-3 rounded text-cream disabled:opacity-40 hover:border-brass transition-colors cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
