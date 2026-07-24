"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import LanguageSwitcher from "./LanguageSwitcher";

export default function SiteHeader({ locale, dict }) {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState("dusk");
  const [themeOpen, setThemeOpen] = useState(false);
  const base = `/${locale}`;

  useEffect(() => {
    const savedTheme = localStorage.getItem("site-theme") || "dusk";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("site-theme", newTheme);
  };

  const navLink = (href, label) => (
    <Link
      href={`${base}${href}`}
      className="px-2.5 py-1 text-[13px] font-medium text-cream/85 hover:text-brass transition-colors tracking-wide"
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-ink-3 bg-ink/95 backdrop-blur">
      {/* Top strip: contact info, mirrors the reference site's institutional feel */}
      <div className="hidden md:flex items-center justify-between px-6 py-1.5 text-xs text-cream-dim border-b border-ink-3">
        <span>{dict.footer.address}: Shrinagar, Barshi Road, Latur, Maharashtra</span>
        <div className="flex gap-4">
          <a href="tel:+919823324839" className="hover:text-brass">+91 98233 24839</a>
          <a href="mailto:rahuljoshi031986@gmail.com" className="hover:text-brass">
            rahuljoshi031986@gmail.com
          </a>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        <Link href={base} className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full plaque flex items-center justify-center font-display text-brass text-lg">
            ॐ
          </div>
          <div className="leading-tight">
            <div className="font-display text-lg text-cream">{dict.home.heroTitle}</div>
            <div className="text-[11px] text-cream-dim hidden sm:block">
              {dict.home.heroSubtitle}
            </div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center">
          {navLink("", dict.nav.home)}
          {navLink("/about", dict.nav.about)}

          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button className="px-2.5 py-1 text-[13px] font-medium text-cream/85 hover:text-brass transition-colors tracking-wide cursor-pointer">
              {dict.nav.services} ▾
            </button>
            {servicesOpen && (
              <div className="absolute top-full left-0 w-56 bg-ink-2 border border-ink-3 rounded-md shadow-xl py-2 rise-in">
                {Object.entries(dict.servicesMenu).map(([key, label]) => (
                  <Link
                    key={key}
                    href={`${base}/services?category=${key}`}
                    className="block px-4 py-2 text-sm text-cream/90 hover:text-brass hover:bg-ink-3"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {navLink("/panchang", dict.nav.panchang)}
          {navLink("/muhurat", dict.nav.muhurat)}
          {navLink("/gallery", dict.nav.gallery)}
          {navLink("/blog", dict.nav.blog)}
          {navLink("/contact", dict.nav.contact)}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher locale={locale} />
          <div className="relative">
            <button
              type="button"
              onClick={() => setThemeOpen(!themeOpen)}
              className="flex items-center justify-center gap-1.5 text-xs border border-ink-3 rounded-full px-3.5 h-[32px] text-cream-dim hover:text-cream hover:border-brass bg-ink-2/30 transition-colors cursor-pointer"
              aria-label="Select Theme"
            >
              {theme === "dusk" ? "🌆 Dusk" : theme === "dawn" ? "🌅 Dawn" : "🌿 Forest"} <span className="text-[10px] text-cream-dim ml-0.5">▾</span>
            </button>
            {themeOpen && (
              <div className="absolute right-0 top-full mt-2 w-32 bg-ink-2 border border-ink-3 rounded-md shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                <button
                  type="button"
                  onClick={() => { changeTheme("dusk"); setThemeOpen(false); }}
                  className="w-full text-left px-3 py-1.5 text-xs text-cream hover:text-brass hover:bg-ink-3 transition-colors flex items-center gap-2"
                >
                  🌆 Dusk
                </button>
                <button
                  type="button"
                  onClick={() => { changeTheme("dawn"); setThemeOpen(false); }}
                  className="w-full text-left px-3 py-1.5 text-xs text-cream hover:text-brass hover:bg-ink-3 transition-colors flex items-center gap-2"
                >
                  🌅 Dawn
                </button>
                <button
                  type="button"
                  onClick={() => { changeTheme("forest"); setThemeOpen(false); }}
                  className="w-full text-left px-3 py-1.5 text-xs text-cream hover:text-brass hover:bg-ink-3 transition-colors flex items-center gap-2"
                >
                  🌿 Forest
                </button>
              </div>
            )}
          </div>
          <Link
            href={`${base}/book`}
            className="hidden sm:inline-flex items-center justify-center bg-sindoor hover:bg-sindoor-light text-cream text-xs font-semibold px-4.5 h-[32px] rounded-full transition-colors border border-sindoor"
          >
            {dict.nav.book}
          </Link>
          <button
            className="lg:hidden text-cream p-2"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Menu"
          >
            ☰
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="lg:hidden flex flex-col border-t border-ink-3 px-4 py-2">
          {navLink("", dict.nav.home)}
          {navLink("/about", dict.nav.about)}
          {navLink("/services", dict.nav.services)}
          {navLink("/panchang", dict.nav.panchang)}
          {navLink("/muhurat", dict.nav.muhurat)}
          {navLink("/gallery", dict.nav.gallery)}
          {navLink("/blog", dict.nav.blog)}
          {navLink("/contact", dict.nav.contact)}
          {navLink("/book", dict.nav.book)}
        </nav>
      )}
    </header>
  );
}
