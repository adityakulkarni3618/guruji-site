# Guruji Rahul Joshi — Website

A bilingual (Marathi/Hindi/English) website for Guruji Rahul Chandrakantrao Joshi's
astrology, vastu, and pooja services — with a full admin panel for managing services,
bookings, daily panchang, muhurat dates, gallery, testimonials, and articles.

## Tech stack

- **Next.js 15** (App Router) — pages + API routes
- **Tailwind CSS** — styling, with a custom "temple at dusk" color theme
- **Drizzle ORM + PostgreSQL** — database (works great with the free tier of
  [Supabase](https://supabase.com) or [Neon](https://neon.tech))
- **astronomy-engine** — calculates the daily panchang (tithi, nakshatra, yoga, karan,
  rahu kaal, etc.) from real sun/moon positions, so there's no ongoing cost or
  dependency on a paid panchang API
- **jose + bcryptjs** — admin authentication (JWT session cookie + hashed passwords)
- **zod** — input validation on all form submissions

No payment gateway is used — bookings are request-based, ending in a call/WhatsApp
prompt, per your requirements.

## 1. One-time setup

### a) Install dependencies

```bash
npm install
```

### b) Create a free Postgres database

1. Go to [supabase.com](https://supabase.com) and create a free project.
2. In **Project Settings → Database**, copy the **Connection string** (choose the
   "Transaction pooler", usually port `6543` — this works best with serverless
   hosting like Vercel).

### c) Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in:
- `DATABASE_URL` — from step (b)
- `SESSION_SECRET` — any long random string (`openssl rand -base64 32`)
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` — Guruji's first admin login

### d) Create the database tables

```bash
npm run db:push
```

This reads `src/db/schema.js` and creates all tables in your Supabase database.

### e) Seed the first admin login + starter services

```bash
npm run db:seed
```

This creates Guruji's admin account and pre-fills six services taken from his
visiting card (Vastu Shanti, Kalsarp Shanti, Saptashati Havan, Janam Kundali,
Gemstone Suggestion, Reiki & Akashic Reading) — all editable/deletable from the
admin panel.

## 2. Run locally

```bash
npm run dev
```

- Public site: http://localhost:3000 (redirects to `/mr`, `/hi`, or `/en` based on
  browser language)
- Admin panel: http://localhost:3000/admin/login

## 3. Deploy for free

**Recommended: Vercel + Supabase (both have generous free tiers)**

1. Push this project to a GitHub repository.
2. Go to [vercel.com](https://vercel.com), import the repo.
3. Add the same environment variables (`DATABASE_URL`, `SESSION_SECRET`) in
   Vercel's Project Settings → Environment Variables.
4. Deploy. Then run `npm run db:push` and `npm run db:seed` once locally (pointed
   at the same production `DATABASE_URL`) to set up tables and the admin login.
5. Connect a custom domain in Vercel's Domains settings when Guruji has one, or
   start on the free `.vercel.app` subdomain.

## 4. What's editable from the admin panel

| Section | What Guruji/assistant can do |
|---|---|
| **Poojas / Services** | Add, edit, delete — name & description in all 3 languages, samagri (ritual items) list, duration, optional price, category, active/inactive toggle |
| **Bookings** | View all booking requests, update status (pending/confirmed/completed/cancelled), see customer contact info |
| **Daily Panchang** | Auto-calculated every day; can be manually overridden for any date |
| **Muhurat Dates** | Add/remove upcoming auspicious dates (marriage, griha pravesh, etc.) |
| **Testimonials** | Add, publish/unpublish, delete |
| **Gallery** | Add photos/videos by URL, delete |
| **Articles** | Write and publish blog posts in all 3 languages |
| **Inquiries** | View contact form submissions, mark as read |
| **Admin Users** | Add a login for the assistant, remove access |

## 5. Notes & things to know

- **Panchang accuracy**: the karan calculation uses a simplified rule for the
  repeating karans; tithi, nakshatra, yoga, sunrise/sunset, and rahu kaal are
  calculated from precise astronomical formulas. Cross-check against Guruji's own
  reference for the first few weeks, and use the manual override in admin if
  anything needs correcting.
- **Media storage**: the gallery/testimonial photo fields take a URL rather than a
  file upload, to keep hosting free — paste links from Google Drive (set to "anyone
  with link can view"), Google Photos, or similar. For a proper private media
  library, Supabase Storage's free tier (1GB) can be added later.
- **WhatsApp number**: currently set to +91 98233 24839 throughout the site (footer,
  floating button, booking confirmation). Update in `src/components/WhatsAppButton.jsx`,
  `src/components/SiteHeader.jsx`, `src/components/SiteFooter.jsx`, and
  `src/components/BookingForm.jsx` if it changes.
- **Location for panchang**: set to Latur, Maharashtra coordinates in
  `src/lib/panchang.js` (`DEFAULT_LOCATION`) — update if needed.
- **Changing the admin password**: there's no in-app "change password" screen yet.
  For now, delete the old admin user row from the `admin_users` table in Supabase's
  table editor and re-run `npm run db:seed` with a new `ADMIN_PASSWORD`.
