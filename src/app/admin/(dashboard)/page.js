async function getStats() {
  try {
    const { db } = await import("@/db");
    const { services, bookings, inquiries, testimonials } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");

    const [svc, bk, inq, pendingTestimonials] = await Promise.all([
      db.select().from(services),
      db.select().from(bookings),
      db.select().from(inquiries).where(eq(inquiries.isRead, false)),
      db.select().from(testimonials).where(eq(testimonials.isApproved, false)),
    ]);

    return {
      totalServices: svc.length,
      totalBookings: bk.length,
      pendingBookings: bk.filter((b) => b.status === "pending").length,
      unreadInquiries: inq.length,
      pendingTestimonials: pendingTestimonials.length,
    };
  } catch {
    return null;
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <div>
      <h1 className="text-2xl text-cream mb-6">Dashboard</h1>

      {!stats ? (
        <div className="plaque p-6 relative">
          <p className="text-cream/90 relative z-10">
            Database isn't connected yet. Add <code className="text-brass">DATABASE_URL</code> to your{" "}
            <code className="text-brass">.env.local</code> and run the migration + seed scripts — see
            README.md.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Services / Poojas" value={stats.totalServices} />
          <StatCard label="Total Bookings" value={stats.totalBookings} />
          <StatCard label="Pending Bookings" value={stats.pendingBookings} highlight />
          <StatCard label="Unread Inquiries" value={stats.unreadInquiries} highlight />
          <StatCard label="Testimonials to Approve" value={stats.pendingTestimonials} highlight />
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, highlight }) {
  return (
    <div className="plaque p-5 relative">
      <div className="relative z-10">
        <div className="text-cream-dim text-sm mb-1">{label}</div>
        <div className={`text-3xl font-numeral ${highlight && value > 0 ? "text-sindoor-light" : "text-brass"}`}>
          {value}
        </div>
      </div>
    </div>
  );
}
