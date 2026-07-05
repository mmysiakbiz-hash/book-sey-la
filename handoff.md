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
- **Magic-link now sent via Brevo API** (`/api/auth/magic-link`, Supabase Admin `generateLink` + Brevo) — no dependency on Supabase Custom SMTP. Web + PWA both call it, with automatic fallback to `signInWithOtp` if `SUPABASE_SERVICE_ROLE_KEY` is unset. Needs that service-role secret in Vercel (server-only).
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

**B. Email deliverability** — code side DONE. Both mails now go through Brevo API: booking confirmation (`/api/book`) and **magic-link** (`/api/auth/magic-link`, Option A — no Supabase SMTP needed). Diagnostics: `/api/health/email` (reports brevo/supabase/serviceRole config; gated test-send via `EMAIL_TEST_TOKEN`). Sender `hello@sey.la` already verified in Brevo (works). REMAINING = set Vercel secrets: `BREVO_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (for magic-link), optional `EMAIL_TEST_TOKEN`; then confirm via the test endpoint. Full steps: `DEPLOY.md §4`.

**C. PWA booking → `/api/book`** (heart of product) — ✅ DONE (see DONE list). Wired: supabase-js UMD + `window.SEY_BOOK`, real email magic-link login, session shared from the site, `BookFlow` writes real bookings via `/api/book`. Depends on **B** for the confirmation/magic-link emails to actually land, and on prod Supabase reachability for studios to carry `dbId` (demo fallback when unreachable). Not yet: a dedicated in-PWA "email OTP code" entry (currently magic-link redirect back to `/pwa/`); staff/deposit not sent (staff_id null, pay handled as before).

**D. Reminders 24h/2h** — ✅ DONE. `GET /api/cron/reminders` (Vercel Cron `vercel.json`, hourly) → SQL fn `public.due_reminders(kind)` (SECURITY DEFINER, resolves customer email from auth.users) → Brevo reminder mail → flips `reminded_24h/2h`. Secured by `CRON_SECRET`. Verified against live DB with temp bookings (24h + 2h buckets correct). Needs `CRON_SECRET` in Vercel; on Hobby plan Vercel Cron runs daily only — use an external hourly scheduler hitting `?token=CRON_SECRET` if hourly is needed. Details: `DEPLOY.md §5`.

**E. Reviews** — ✅ DONE. Post-visit review-request email folded into the hourly cron (`due_review_requests()` SQL fn + `bookings.review_requested_at` flag + `reviews.booking_id` unique). Submission: public page `/review/[bookingId]?t=<token>` → `POST /api/review` (service role insert; token = HMAC of bookingId via `lib/reviewToken.js`, `REVIEW_SECRET`/`CRON_SECRET`). Venue page repointed: `getStudioBySlug` embeds `reviews(...)`, real reviews lead the list + drive the headline score/count; `VenueClose` renders per-review star ratings. Needs `SUPABASE_SERVICE_ROLE_KEY`, `BREVO_API_KEY`, `REVIEW_SECRET`(or `CRON_SECRET`). Details: `DEPLOY.md §6`.

**F. Panels wired to Supabase** — ✅ mostly done. `/panel` now has a **Bookings** tab: owner's real bookings (RLS `bookings_read` via `owns_studio`), grouped by day, upcoming + past, with cancel (RLS `bookings_update`). `lib/owner.js` `getStudioBookings`/`setBookingStatus`. Services/team/hours config writes already done in G. Verified vs live DB (owner reads + cancels own studio's bookings). REMAINING: admin stats on `/admin` from real data (still the demo `AdminPanel`); reschedule; per-staff filtering.

**G. Studio self-service configurator** — ✅ DONE (core). `/panel` = login-gated (magic-link) multi-step wizard (`components/studio/OwnerPanel.js` + `lib/owner.js`): Basics → About → Location → Hours → Services → Team → Photos (upload to `studio-photos` bucket) → Contact/Social → Publish. Writes via RLS (`owns_studio`, `studios_insert/update`) on the user session — no service role. `gen_studio_slug()` makes a unique slug; **Publish sets status='active' → live immediately at `/studio/<slug>`** (migration broadened `studio_public`/`studios_read` to include 'active'; 'verified' is now a separate admin badge). Draft studios hidden from public. Added `studios.socials` (jsonb) + `staff.role`. `for-studios` CTAs point to `/panel`. Venue page now renders real hours + socials + team. Verified end-to-end against live DB as an authenticated user (create→services/staff/hours→publish→anon read; draft hidden) + cleaned up. Follow-ups: photo auto-crop/reorder, resume-step memory, owner can't yet create a 2nd studio (one per owner by design for now).

**H. Classes** — ✅ DONE (web). Owner manages sessions in `/panel` → Classes tab (`class_sessions_write` RLS): add/list/delete with booked counts. Public studio page shows upcoming classes with **live spots left** (`class_sessions_public()` SECURITY DEFINER rpc → counts without exposing attendees) and inline **Join** → `POST /api/class-book` (service role insert — `class_bookings` has no client INSERT; capacity-checked, dedupe unique index per email/session, Brevo confirmation). Verified vs live DB (owner create → public spots → book → decrement → dedupe). REMAINING: wire the PWA Classes screen (currently mock demo) to the same rpc + `/api/class-book` (mirrors the PWA booking bridge).

**I. Staff selection at booking** + staff calendar (staff table currently name/color/active only — extend if needed for photos/roles).

**J. Payments / deposits** — `bookings.price_eur / commission_due`; deposit + no-show (Stripe?).

**K. Favourites, wallet/referrals** — tables exist (`favourites`, `wallet_transactions`, `referrals`), wire.

**L. Auth polish** — optional phone OTP (needs SMS provider); proper account management, sign-out everywhere.

## Notes for the agent
- This session can push directly (started from the repo) — commit + push; Vercel auto-deploys. (The bootstrap session couldn't push and handed off via zip/bundle.)
- Supabase MCP may be attached — use it to confirm schema before writing queries and to seed data. `reviews`/`bookings`/`staff` columns already captured; `business_hours`/`class_sessions` not yet.
- Always keep the demo-fallback pattern so the UI never breaks when Supabase is unreachable.
