# sey.la | book — Next.js app (3 surfaces)

One Next.js 14 project. Client PWA in `public/pwa/` (installable, offline). Web sections in `components/sections/`.
Routes: /, /search, /studio/[slug], /for-studios, /panel (salon), /admin, /account, /business, /embed, legal.
Run: `cp .env.example .env.local` (fill in Supabase), then `npm install && npm run dev` (or `npm run build && npm start`).

## Backend (Supabase)
Wired to the **book-seyla** Supabase project (ref `eoapvjnaievxqkbmtxar`, eu-west-2) — a complete schema already exists: `studios, staff, services, business_hours, time_off, bookings, clients, admins, loyalty_programs, loyalty_redemptions, reviews, class_sessions, class_bookings, favourites, referrals, wallet_transactions`, RLS enabled with public read policies on `studios/services/class_sessions`.
- Client: `lib/supabaseClient.js` (publishable/anon key — safe for the browser; RLS enforces access).
- Env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (see `.env.example`). Set the same two vars in Vercel → Project → Environment Variables.
- Live read proof: `GET /api/studios` returns studios straight from Supabase.
- **Live listings:** `/` (Recommended), `/search` (+ real per-category counts) and `/studio/[slug]` (venue detail: studio + grouped service menu) fetch from Supabase (`lib/studios.js` → `getStudios` / `getStudioBySlug`, server-side, `dynamic = "force-dynamic"`), each with a graceful fallback to built-in demo data if Supabase is unreachable — so the UI never breaks. Seeded with 9 studios + 20 services mirroring the app content.
- **Client PWA** reads live studios too: `public/pwa/live.js` fetches from Supabase, maps to the app shape, overwrites `SEY_DATA.STUDIOS`, then loads `App.js` — with a 2.5s timeout that falls back to bundled demo data. (Verified end-to-end via a mocked response.)
- **Venue detail** also wires score/rating, name, location, address (seeded, live) and — defensively, with demo fallback — the review cards (from `studios.google_reviews`) and gallery (from `studios.photos`). These stay on demo until those jsonb columns are seeded; team, classes and hours remain demo (their tables weren't seeded / schema unconfirmed).
## Auth + booking writes (magic link)
Real booking writes are wired on the venue page, gated by Supabase Auth (email **magic link**):
- `lib/auth.js` (`sendMagicLink`/`getSessionUser`/`signOut`), `lib/useUser.js` (client session hook), `app/login/page.js`.
- `lib/bookings.js` `createBooking()` inserts into `bookings` (`during` as a `tstzrange`, `customer_id = auth.uid()` per RLS). `getMyBookings()` lists the signed-in customer's bookings.
- Venue service rows open a `BookNow` picker (date/time) → confirm booking; logged out → "Log in to book". `/account` shows the signed-in user + their real bookings; Nav "Log in" → `/login`.

**Required Supabase config before this works on a deployment:**
1. Auth → Providers → **Email** enabled (it is by default).
2. Auth → URL Configuration → **Redirect URLs**: add your deployed origin + `/account` (e.g. `https://your-app.vercel.app/account`) and `http://localhost:3000/account` for local.
3. The magic-link redirect target is `window.location.origin + "/account"`.

### Confirmation email (Brevo)
Bookings are created server-side via **`POST /api/book`** (not a direct client insert): it authorises the caller with their bearer token (RLS still binds `customer_id = auth.uid()`), inserts the booking, then sends a branded confirmation email from **hello@sey.la** via the **Brevo API** (`lib/email.js`). `createBooking()` posts to this route.
- **`BREVO_API_KEY`** is a **server-side secret** — set it in Vercel → Environment Variables (and `.env.local` for dev). **Never** prefix with `NEXT_PUBLIC_`; it's only read in `/api/book`.
- The magic-link email itself is sent by Supabase Auth → configure **Brevo SMTP** under Supabase Auth → SMTP Settings (host `smtp-relay.brevo.com`, port 587).
- Email is best-effort: if Brevo fails, the booking is still saved (`emailed:false` returned).

Notes: verified in-sandbox only for the logged-out / error paths (login form, "Log in to book" gate, guest account, and `/api/book` returning 401/400 for bad input) — the actual login, insert and email can't run here (Supabase/Brevo egress blocked + magic link needs a real inbox); it's code-complete against the confirmed schema and runs on deploy. `reviews` has no client INSERT policy, so review submission needs a server/Edge Function (separate follow-up). The PWA booking flow still writes to mock data — wiring it needs Supabase JS added to `public/pwa/` (bigger follow-up).

Verified: `next build` compiles clean, all 13 routes render with no runtime/hydration errors, and the client PWA mounts and navigates (Home/Search/Bookings/Account). External Unsplash photos + Google Fonts need network at runtime.

## Client app (public/pwa/)
Discover · search + map · studio profile · booking (services → staff → time → payment/deposit → confirm) · recurring · group classes · bookings + cancel/reschedule/book-again · waitlist · loyalty stamps · reviews · packages & gift cards · payment methods (deposits, no-show, balances) · messaging · notification settings (per-type × push/SMS/email) · language (EN/FR/Kreol) · phone-OTP login.

## Salon panel (/panel, responsive)
My-day agenda (phone) + multi-staff swimlane (desktop) · add/edit/block appointments · client profiles + notes · services/team/hours config · Google reviews · insights · payments (deposits, no-show fee, payouts) · marketing (promos, codes, blasts) · onboarding wizard.

## Admin (/admin)
Ops dashboard: studios, verify/suspend, MRR, stats.

## Embed (/embed)
"Put your calendar on your site": one-line embed snippet with copy-to-clipboard + a live, interactive widget preview (service, day, time-slot, accent swatch).

## Client PWA build detail
The PWA is a self-contained app under `public/pwa/`. React/ReactDOM are **self-hosted** (`public/pwa/vendor/`, production UMD) — no CDN, works offline and behind a strict CSP. `App.jsx` is the editable source; `App.js` is the **pre-transpiled** output loaded by `index.html` (no in-browser Babel). After editing `App.jsx`, re-transpile with `@babel/preset-react` (classic runtime) to regenerate `App.js`, then bump the service-worker `CACHE` version.

## Fixes applied to the export
- Inline `<style>` blocks in the shared components now render via `dangerouslySetInnerHTML` — this removes an SSR/hydration mismatch (`>` child combinators were HTML-escaped on the server but literal on the client, throwing React #425 on `/` and `/search`).
- Client PWA de-CDN'd: dropped unpkg React (was the *development* build) + in-browser Babel; vendored production React and pre-compiled `App.jsx` → `App.js`. Service worker precache updated to the local files, cache bumped to `v7`.
- Bumped `next` 14.2.5 → 14.2.35 (patches the flagged critical advisory). Remaining `npm audit` items require a Next 16 major upgrade (breaking) and are self-hosted DoS/cache advisories — left for a deliberate upgrade rather than forcing it here.

Notes: wallet credit is a placeholder; SW cache versioned (bump on deploy, currently v7); photos are Unsplash demos; real map needs a maps provider; full i18n string extraction + a11y audit are dev-phase. All UI is mocked — wire to backend.
