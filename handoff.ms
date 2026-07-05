# book-sey-la — HANDOFF (read this first)

Living status + TODO for the sey.la | book platform. Update as things land.

## Facts / where things live
- **Repo:** github.com/mmysiakbiz-hash/book-sey-la → **Vercel:** https://book-sey-la.vercel.app (Root Directory `./`, Next.js 14 App Router).
- **Supabase:** project `book-seyla`, ref **`eoapvjnaievxqkbmtxar`** (eu-west-2). Full schema, RLS on. Seeded **9 studios + 20 services**.
- **Env (Vercel + .env.local):** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (publishable), `BREVO_API_KEY` (server-side secret — no NEXT_PUBLIC).
- **Email:** magic-link login = Supabase Auth via **Brevo SMTP** (`smtp-relay.brevo.com:587`). Our transactional (booking confirmation) = **Brevo API** in `/api/book`. Sender `hello@sey.la`.
- **Data layer:** `lib/studios.js` (getStudios / getStudioBySlug), `lib/bookings.js` (createBooking → POST /api/book, getMyBookings), `lib/auth.js` + `lib/useUser.js`, `lib/email.js` (Brevo). Route `app/api/book/route.js`, `app/api/studios/route.js`.
- Live-read proof: `GET /api/studios` returns the 9 studios (confirmed working in prod).

## Architecture (3 surfaces, one deploy)
- **Client** = mobile PWA at `public/pwa/` (served at `/pwa/index.html`), own router + tab bar. The heart of the product.
- **Salon** = `/panel` (responsive: phone "My day" agenda + desktop swimlane).
- **Admin** = `/admin` (desktop ops).
- Plus marketing/legal: `/`, `/search`, `/studio/[slug]`, `/for-studios`, `/business`, `/account`, `/login`, `/embed`, about/contact/privacy/terms/refund.

## DONE
- Working Next.js app; `next build` clean; all routes render (verified headless).
- SSR/hydration fixes (inline `<style>` → dangerouslySetInnerHTML).
- PWA de-CDN'd: self-hosted React + pre-transpiled App.js (no unpkg/Babel); SW cache v8. Reads live studios via `public/pwa/live.js` (fallback to demo).
- Live reads wired: `/` recommended, `/search` (+ real category counts), `/studio/[slug]` (studio + grouped service menu). Demo fallback everywhere.
- Venue: score/name/location/address live; reviews **hidden until real reviews exist** (from `studios.google_reviews`), layout self-adjusts.
- Auth: email **magic link** (`/login`), session hook, `/account` shows signed-in user + their real bookings. Nav "Log in" → /login.
- Booking WRITE: venue "Book" → date/time picker → `POST /api/book` (auth via bearer token, RLS binds customer_id=auth.uid(), `during` as tstzrange) → **Brevo confirmation email** from hello@sey.la. Best-effort email (booking saved even if email fails).

## KNOWN ISSUES (fix early)
1. **Magic-link email not arriving.** Check: spam; Supabase → Auth → Logs (SMTP error?); Supabase → Auth → Emails → SMTP Settings (Custom SMTP enabled+saved); Brevo → Transactional Logs; Brevo sender/domain `hello@sey.la` verified (SPF/DKIM). Likely config, not code.
2. **`{}` glitch on `/login`** — the `Input` component renders a `<style>` as a flex child (`components/core/Input.js`); it leaks as visible text in the login layout. Fix: move the `<style>` out of the flex row / mark display:none, or scope CSS in globals.css.
3. **No navigation between surfaces.** Landing doesn't link to `/for-studios`, `/panel`, `/admin`, `/business`, `/account`, or the PWA. Nav "For studios" points to `#studios` (dead anchor). **PWA has no entry point** — users can't find the mobile app.

## TODO (prioritised)
**A. Navigation & discoverability (do first — cheap, high impact)**
- Real nav + footer links to every surface; fix "For studios" (`#studios` → `/for-studios`).
- Prominent **"Open app"** → `/pwa/` (consider `/` → PWA redirect on mobile widths).
- Fix the `{}` login glitch.

**B. Email deliverability** — get magic link + booking confirmation actually landing (Brevo SMTP + sender verify + test end-to-end).

**C. PWA booking → `/api/book`** (heart of product) — wire the mobile BookFlow to write real bookings + confirmation email (currently mock). Needs Supabase auth in the PWA (add supabase-js UMD to `public/pwa/` or call REST/auth endpoints directly).

**D. Reminders 24h/2h** — cron (Vercel Cron or Supabase Edge Function) using `bookings.reminded_24h/reminded_2h` + Brevo API.

**E. Reviews** — post-visit review-request email; review submission via server/Edge Function (table `reviews` has **no client INSERT** policy). Then repoint venue reviews to the `reviews` table (FK embed) so the section lights up.

**F. Panels wired to Supabase** — `/panel` agenda from real `bookings`; services/team/hours config writes (`owns_studio` RLS); admin stats from real data.

**G. Studio self-service page editor** — owner edits their public venue page → writes to `studios` (tagline, photos, etc.).

**H. Classes** — `class_sessions` / `class_bookings`: join class + live spots.

**I. Staff selection at booking** + staff calendar (staff table currently name/color/active only — extend if needed for photos/roles).

**J. Payments / deposits** — `bookings.price_eur / commission_due`; deposit + no-show (Stripe?).

**K. Favourites, wallet/referrals** — tables exist (`favourites`, `wallet_transactions`, `referrals`), wire.

**L. Auth polish** — optional phone OTP (needs SMS provider); proper account management, sign-out everywhere.

## Notes for the agent
- This session can push directly (started from the repo) — commit + push; Vercel auto-deploys. (The bootstrap session couldn't push and handed off via zip/bundle.)
- Supabase MCP may be attached — use it to confirm schema before writing queries and to seed data. `reviews`/`bookings`/`staff` columns already captured; `business_hours`/`class_sessions` not yet.
- Always keep the demo-fallback pattern so the UI never breaks when Supabase is unreachable.
