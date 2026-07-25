"use client";

import { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 10;

export default function AdminInquiriesPage() {
  const [items, setItems] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  function load() {
    fetch("/api/admin/inquiries").then((r) => r.json()).then(setItems);
  }
  useEffect(load, []);

  async function markRead(id) {
    await fetch(`/api/admin/inquiries/${id}`, { method: "PUT" });
    load();
  }

  // Reset page when search term changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  if (!items) {
    return <p className="text-cream-dim">Loading…</p>;
  }

  const filtered = items.filter((i) => {
    const term = search.toLowerCase();
    return (
      i.name?.toLowerCase().includes(term) ||
      i.phone?.toLowerCase().includes(term) ||
      i.email?.toLowerCase().includes(term) ||
      i.message?.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl text-cream">Contact Inquiries</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search inquiries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-ink-2 border border-ink-3 text-cream rounded-md px-3 py-1.5 text-sm w-full md:w-64 focus:outline-none focus:border-brass"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-cream-dim">No inquiries found.</p>
      ) : (
        <div className="space-y-4">
          <div className="space-y-3">
            {paginated.map((i) => (
              <div key={i.id} className={`border rounded-md p-4 transition-all duration-200 hover:bg-ink-2/20 ${i.isRead ? "border-ink-3" : "border-brass bg-brass/5"}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-cream font-semibold flex items-center gap-2">
                      {i.name}
                      {!i.isRead && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-brass text-ink">
                          New
                        </span>
                      )}
                    </div>
                    <div className="text-cream-dim text-xs mt-1">
                      {i.phone} {i.email ? `· ${i.email}` : ""}
                    </div>
                  </div>
                  {!i.isRead && (
                    <button
                      onClick={() => markRead(i.id)}
                      className="text-brass text-sm hover:underline cursor-pointer select-none font-medium"
                    >
                      Mark Read
                    </button>
                  )}
                </div>
                <p className="text-cream/90 text-sm mt-3 whitespace-pre-line leading-relaxed">{i.message}</p>
              </div>
            ))}
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
