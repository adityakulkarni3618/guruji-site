"use client";

import { useEffect, useState } from "react";

export default function AdminInquiriesPage() {
  const [items, setItems] = useState(null);

  function load() {
    fetch("/api/admin/inquiries").then((r) => r.json()).then(setItems);
  }
  useEffect(load, []);

  async function markRead(id) {
    await fetch(`/api/admin/inquiries/${id}`, { method: "PUT" });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl text-cream mb-6">Contact Inquiries</h1>
      {items && (
        <div className="space-y-3">
          {items.map((i) => (
            <div key={i.id} className={`border rounded-md p-4 ${i.isRead ? "border-ink-3" : "border-brass"}`}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-cream font-semibold">{i.name}</div>
                  <div className="text-cream-dim text-xs">
                    {i.phone} {i.email ? `· ${i.email}` : ""}
                  </div>
                </div>
                {!i.isRead && (
                  <button onClick={() => markRead(i.id)} className="text-brass text-sm hover:underline">
                    Mark Read
                  </button>
                )}
              </div>
              <p className="text-cream/90 text-sm mt-2">{i.message}</p>
            </div>
          ))}
          {items.length === 0 && <p className="text-cream-dim">No inquiries yet.</p>}
        </div>
      )}
    </div>
  );
}
