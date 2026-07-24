import { NextResponse } from "next/server";
import { locales, defaultLocale } from "@/i18n/dictionaries";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Admin panel: English-only internal tooling, gated by session cookie.
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();

    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = token ? await verifySessionToken(token) : null;

    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const hasLocale = locales.some(
    (loc) => pathname === `/${loc}` || pathname.startsWith(`/${loc}/`)
  );
  if (hasLocale) return NextResponse.next();

  // Prefer a saved cookie choice, then browser Accept-Language, then default.
  const cookieLocale = request.cookies.get("locale")?.value;
  const acceptLang = request.headers.get("accept-language") || "";
  const browserLocale = locales.find((loc) => acceptLang.includes(loc));
  const locale = locales.includes(cookieLocale)
    ? cookieLocale
    : browserLocale || defaultLocale;

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api).*)"],
};
