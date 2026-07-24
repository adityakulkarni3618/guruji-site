import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/services", label: "Poojas / Services" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/panchang", label: "Daily Panchang" },
  { href: "/admin/muhurat", label: "Muhurat Dates" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/blog", label: "Articles" },
  { href: "/admin/inquiries", label: "Inquiries" },
  { href: "/admin/users", label: "Admin Users" },
];

export default function AdminDashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-ink">
      <aside className="w-64 shrink-0 border-r border-ink-3 bg-ink-2 p-5 hidden md:flex md:flex-col">
        <div className="mb-8">
          <div className="text-brass font-display text-lg">Guruji Rahul Joshi</div>
          <div className="text-cream-dim text-xs">Admin Panel</div>
        </div>
        <nav className="flex-1 space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2 rounded-md text-sm text-cream/90 hover:bg-ink-3 hover:text-brass transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <LogoutButton />
      </aside>
      <main className="flex-1 p-6 md:p-10 overflow-x-auto">{children}</main>
    </div>
  );
}
