"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import LogoutButton from "@/components/admin/LogoutButton";
import { getAdminDict, getAdminLang, setAdminLang } from "@/lib/adminLang";

export default function AdminDashboardLayout({ children }) {
  const [lang, setLang] = useState("mr");
  const [dict, setDict] = useState(null);

  useEffect(() => {
    // Set initial language
    setLang(getAdminLang());
    setDict(getAdminDict());

    // Listen for language change events
    const handleLangChange = () => {
      setLang(getAdminLang());
      setDict(getAdminDict());
    };
    window.addEventListener("admin-lang-change", handleLangChange);
    return () => window.removeEventListener("admin-lang-change", handleLangChange);
  }, []);

  function handleLanguageSwitch(newLang) {
    setAdminLang(newLang);
  }

  if (!dict) {
    return <div className="min-h-screen bg-ink flex items-center justify-center text-cream-dim">Loading Dashboard…</div>;
  }

  const NAV = [
    { href: "/admin", label: dict.admin.dashboard },
    { href: "/admin/services", label: dict.admin.services },
    { href: "/admin/bookings", label: dict.admin.bookings },
    { href: "/admin/panchang", label: dict.admin.panchang },
    { href: "/admin/muhurat", label: dict.admin.muhurat },
    { href: "/admin/testimonials", label: dict.admin.testimonials },
    { href: "/admin/shlokas", label: dict.admin.shlokas },
    { href: "/admin/gallery", label: dict.admin.gallery },
    { href: "/admin/blog", label: dict.admin.articles },
    { href: "/admin/inquiries", label: dict.admin.inquiries },
    { href: "/admin/users", label: dict.admin.users },
  ];

  return (
    <div className="min-h-screen flex bg-ink">
      <aside className="w-64 shrink-0 border-r border-ink-3 bg-ink-2 p-5 hidden md:flex md:flex-col justify-between">
        <div>
          <div className="mb-6">
            <div className="text-brass font-display text-lg">Guruji Rahul Joshi</div>
            <div className="text-cream-dim text-xs">Admin Panel</div>
          </div>

          {/* Admin Language Switcher */}
          <div className="mb-6 flex items-center justify-between gap-1 border-b border-ink-3 pb-4">
            <span className="text-xs text-cream-dim font-medium">भाषा / Lang:</span>
            <select
              value={lang}
              onChange={(e) => handleLanguageSwitch(e.target.value)}
              className="bg-ink text-cream border border-ink-3 rounded px-2 py-1 text-xs focus:outline-none focus:border-brass cursor-pointer"
            >
              <option value="mr">मराठी</option>
              <option value="hi">हिंदी</option>
              <option value="en">English</option>
            </select>
          </div>

          <nav className="space-y-1">
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
        </div>
        <div className="mt-8 pt-4 border-t border-ink-3">
          <LogoutButton label={dict.admin.logout} />
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-10 overflow-x-auto">{children}</main>
    </div>
  );
}
