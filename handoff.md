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
- PWA de-CDN'd: self-hosted React + pre-transpiled App.js (no unpkg/Babel); SW cache v9. Reads live studios via `public/pwa/live.js` (fallback to demo).
- **PWA transpile is now scripted**: edit `public/pwa/App.jsx` → `npm run build:pwa` (`scripts/build-pwa.cjs`, @babel/preset-react classic) regenerates `App.js`. Reproduces the committed output byte-for-byte — no more hand-maintaining App.js.
- **PWA auth + real bookings (C)**: self-hosted `supabase-js` UMD (`public/pwa/vendor/supabase.js`) + `public/pwa/booking.js` (`window.SEY_BOOK`). Uses the DEFAULT storage key → **shares the session with the marketing site login on the same origin**. PWA `Login` is **email magic link only** (phone/SMS mock removed — we're email-only). `BookFlow` confirm now fires a real `POST /api/book` (studio+service UUIDs carried through `live.js`) when a studio has a live `dbId` and a session exists — otherwise keeps the local/demo booking so the UI never breaks. SW no longer caches `*.supabase.co` (was risking stale sessions/data).
- Live reads wired: `/` recommended, `/search` (+ real category counts), `/studio/[slug]` (studio + grouped service menu). Demo fallback everywhere.
- Venue: score/name/location/address live; reviews **hidden until real reviews exist** (from `studios.google_reviews`), layout self-adjusts.
- Auth: email **magic link** (`/login`), session hook, `/account` shows signed-in user + their real bookings. Nav "Log in" → /login.
- Booking WRITE: venue "Book" → date/time picker → `POST /api/book` (auth via bearer token, RLS binds customer_id=auth.uid(), `during` as tstzrange) → **Brevo confirmation email** from hello@sey.la. Best-effort email (booking saved even if email fails).

## KNOWN ISSUES (fix early)
1. **Magic-link / confirmation email not arriving.** Config, not code. Now diagnosable end-to-end (B): `GET /api/health/email` shows `brevoConfigured`; with `EMAIL_TEST_TOKEN` set, `?to=…&token=…` does a real Brevo test-send and returns the exact error (usually "sender not valid" → verify `hello@sey.la`/`sey.la` SPF+DKIM in Brevo). Booking-email failures now log server-side (`[book]`/`[email]`, visible in Vercel logs). **Full step-by-step in `DEPLOY.md §4`** (Brevo sender verify → test endpoint → Supabase Custom SMTP for magic-link).
2. ~~**`{}` glitch on `/login`**~~ — FIXED (A). Moved `Input`'s inline `<style>` out of the flex row into `globals.css` (`.sey-input` scoped rules).
3. ~~**No navigation between surfaces.**~~ — FIXED (A). Nav "For studios" → `/for-studios`; added prominent **"Open app" → `/pwa/`** (desktop + mobile menu); footer now links every surface (Open app, Explore, For studios, Business, My account, Log in, Privacy, Terms, Refunds, Support). Still open: no `/` → PWA auto-redirect on mobile widths (deferred).

## TODO (prioritised)
**A. Navigation & discoverability (do first — cheap, high impact)** — ✅ DONE
- ✅ Real nav + footer links to every surface; "For studios" now `/for-studios`.
- ✅ Prominent **"Open app"** → `/pwa/` in nav + mobile menu + footer. (`/` → PWA redirect on mobile widths: deferred.)
- ✅ Fixed the `{}` login glitch.

**B. Email deliverability** — code side DONE (diagnostic endpoint `/api/health/email`, server logging, `DEPLOY.md §4` checklist, `.env.example`). REMAINING = dashboard config only: verify `hello@sey.la`/`sey.la` sender in Brevo (SPF+DKIM), set `BREVO_API_KEY` (+ optional `EMAIL_TEST_TOKEN`) in Vercel, enable Supabase Custom SMTP (Brevo relay) for magic-link. Then confirm with the test endpoint.

**C. PWA booking → `/api/book`** (heart of product) — ✅ DONE (see DONE list). Wired: supabase-js UMD + `window.SEY_BOOK`, real email magic-link login, session shared from the site, `BookFlow` writes real bookings via `/api/book`. Depends on **B** for the confirmation/magic-link emails to actually land, and on prod Supabase reachability for studios to carry `dbId` (demo fallback when unreachable). Not yet: a dedicated in-PWA "email OTP code" entry (currently magic-link redirect back to `/pwa/`); staff/deposit not sent (staff_id null, pay handled as before).

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
