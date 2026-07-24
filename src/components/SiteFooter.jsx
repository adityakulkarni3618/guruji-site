import Link from "next/link";

export default function SiteFooter({ locale, dict }) {
  const base = `/${locale}`;
  return (
    <footer className="border-t border-ink-3 bg-ink mt-16">
      <div className="max-w-6xl mx-auto px-6 py-10 grid gap-8 md:grid-cols-3 text-sm">
        <div>
          <div className="font-display text-lg text-brass mb-2">{dict.home.heroTitle}</div>
          <p className="text-cream-dim">{dict.home.heroSubtitle}</p>
        </div>
        <div>
          <div className="text-brass font-semibold mb-2">{dict.footer.quickLinks}</div>
          <ul className="space-y-1 text-cream-dim">
            <li><Link href={`${base}/about`} className="hover:text-brass">{dict.nav.about}</Link></li>
            <li><Link href={`${base}/services`} className="hover:text-brass">{dict.nav.services}</Link></li>
            <li><Link href={`${base}/panchang`} className="hover:text-brass">{dict.nav.panchang}</Link></li>
            <li><Link href={`${base}/book`} className="hover:text-brass">{dict.nav.book}</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-brass font-semibold mb-2">{dict.footer.address}</div>
          <p className="text-cream-dim">
            Behind Vidyavikas School, Shrinagar,<br />Barshi Road, Latur, Maharashtra
          </p>
          <p className="text-cream-dim mt-2">
            +91 98233 24839 · +91 99700 26324<br />
            rahuljoshi031986@gmail.com
          </p>
        </div>
      </div>
      <div className="text-center text-xs text-cream-dim/70 py-4 border-t border-ink-3">
        © {new Date().getFullYear()} {dict.home.heroTitle}. {dict.footer.rights}
      </div>
    </footer>
  );
}
