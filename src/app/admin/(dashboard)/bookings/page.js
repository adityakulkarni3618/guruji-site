"use client";

import { useEffect, useState } from "react";

const STATUSES = ["pending", "confirmed", "completed", "cancelled"];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState(null);

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

  return (
    <div>
      <h1 className="text-2xl text-cream mb-6">Bookings</h1>
      {!bookings ? (
        <p className="text-cream-dim">Loading…</p>
      ) : bookings.length === 0 ? (
        <p className="text-cream-dim">No booking requests yet.</p>
      ) : (
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
              {bookings.map((b) => (
                <tr key={b.id} className="border-t border-ink-3 align-top">
                  <td className="p-3 text-cream">
                    {b.customerName}
                    {b.city ? <div className="text-cream-dim text-xs">{b.city}</div> : null}
                  </td>
                  <td className="p-3 text-cream-dim">
                    <a href={`tel:${b.customerPhone}`} className="hover:text-brass">{b.customerPhone}</a>
                  </td>
                  <td className="p-3 text-cream-dim">{b.serviceName}</td>
                  <td className="p-3 text-cream-dim">
                    {b.preferredDate || "—"} {b.preferredTime || ""}
                  </td>
                  <td className="p-3">
                    <select
                      value={b.status}
                      onChange={(e) => updateStatus(b.id, e.target.value)}
                      className="bg-ink-2 border border-ink-3 text-cream rounded-md px-2 py-1 text-sm"
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
      )}
    </div>
  );
}
