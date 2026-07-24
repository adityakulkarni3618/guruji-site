import { verifySessionToken, SESSION_COOKIE_NAME } from "./auth";

// Defense in depth: middleware already blocks unauthenticated page loads,
// but API routes verify the session independently too, in case they're
// ever called directly.
export async function requireAdmin(request) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;
  return session; // null if not authenticated
}
