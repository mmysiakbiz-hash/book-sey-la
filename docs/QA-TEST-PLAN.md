# book.sey.la — QA test brief (Client / Salon / Admin)

Paste this to a Claude Cowork agent. Goal: exercise **every** use case from the three
perspectives and report defects. Drive the app in a real browser (Playwright/Chromium),
test at **desktop (≥1200px)** and **mobile (390px)** widths.

## Surfaces
- **Web (Next.js):** `https://book.sey.la` — `/`, `/search`, `/studio/[slug]`, `/account`,
  `/panel` (owner), `/claim/[slug]`, `/for-studios`, `/login`, `/contact`, `/admin`.
- **PWA (separate app):** `https://book.sey.la/pwa` — client app + owner "pro" mode. **Requires login to enter.**
- Backend: Supabase (RLS) + Brevo email. **No online payment** (pay on-site). **No push/SMS** (email only).

## Existing test data
- Studios: `old-school-barber` (Beau Vallon, has hours, may have 0 services), `test-barber-victoria`
  (has services Skin fade / Beard trim, staff "Marc", hours). ~5 test bookings. No real reviews/clients/classes.

## ⚠️ Blockers to arrange BEFORE testing (tell the human)
1. **Login is passwordless magic-link (email).** To test any logged-in flow the agent needs
   to **read the sign-in email and open its link** → provide a **test mailbox the agent can access**
   (or a pre-authenticated browser session). Without it, only logged-out surfaces are testable.
2. **Booking, "message clients", claim, contact send REAL emails via Brevo.** Use **test email
   addresses only**; never mass-send; keep volume low.
3. **/admin** needs `ADMIN_TOKEN` or an admin-enrolled session — request from the human if admin flows are in scope.
4. Owner "pro" mode requires an account that **owns a studio** (e.g. the owner of a test studio).

## Invariants to assert on EVERY screen (global acceptance criteria)
- **Currency:** client-facing **service/package prices in SCR**; the **referral bonus is SCR 250** (client-facing, in SCR — this is intentional, not a bug); only the **studio subscription/MRR is EUR (€25/month)**. No mix-ups. A price-less service shows **"On request"**, never "SCR 0".
- **Timezone:** every slot/booking/agenda time is **Mahé (UTC+4)** — a time picked as 14:00 must persist/show as 14:00 Mahé.
- **No fake/placeholder data:** no invented ratings (e.g. "4.9 (128)"), reviews, opening hours, "Available today", or demo studios (Kreol Spa, L'Accent Barber…). Empty → honest empty state.
- **No false promises:** nothing claims push notifications, SMS, online payment, or spendable gift-card/wallet credit (there are none).
- **Brand links** (logo, "powered by") go to **book.sey.la**, never the parent `sey.la`.
- **Mobile:** no horizontal page scroll / elements bleeding off the right edge.

---

## 1) CLIENT

Discovery & search
- Home: categories, "Popular" chips (filter by type), island chips, "Visited & favourites" hub (only if you have history/favourites) with **Book again**.
- `/search`: text query matches name/category/service; **location/island** filter works (island chip `?loc=Mahé`); category chips; sort (Recommended / Top rated / Price).
- **Map (Airbnb-style):** floating **Map/List** toggle; map shows real OSM pins; **draggable sheet** (drag handle up/down, snaps); clear way back to list. No fake grid.

Studio page (`/studio/test-barber-victoria`)
- Services grouped w/ **SCR** prices + duration; **Book** buttons. Team shows photos (if set). Packages shown only if defined. Hours table only if real hours. Reviews section only if real reviews. **Share** button opens native share / copies link. No fake rating pill.

Booking flow (the core)
- Logged out → tapping Book leads to **login gate** (magic link). Log in.
- Pick service → **staff list filtered to those who perform it** ("Any professional" + eligible staff).
- Day/time → **slots come from the studio's real opening hours**, in **30-min steps**, **past times on "today" removed**, **closed days show no slots**. Times are **Mahé**.
- Confirm → success + **confirmation email arrives** (Brevo). Verify the emailed time = picked time (Mahé) and price in **SCR**.
- Edge: try a closed day (no slots), a studio with 0 services (empty menu, no booking).

Manage bookings (`/account` web, Bookings tab PWA)
- Reschedule (date+time, Mahé), **Cancel shows a confirmation** (in-app on PWA; dialog on web) then cancels, "Book again", upcoming vs history split, statuses correct.

Account (web + PWA)
- Real **Visits** count (no fake "Your rating 4.9"). Favourites. Notifications screen is **email-only + honest** ("push/SMS not available yet"). No push toggle pretending to work.

Classes (client)
- If a studio has classes: join a class; when **full → "Join waitlist"** and a waitlist email (not a hard rejection). (Note: classes are currently hidden in the PWA — verify they don't show fake ones.)

PWA specifics
- **Cannot enter the PWA without logging in** (first screen = login hero). After login, **no fake studios** (real only, else empty). Owner accounts go straight to the pro dashboard (see §2).

## 2) SALON (owner)

Onboarding wizard (`/panel`, new or via `/claim/[slug]`)
- Steps: Basics, About, **Location** (address+island → auto-geocode → pin appears on the live page map), **Hours** (rows aligned), **Services** (price in **SCR**, **leaving price blank must save fine** and show "On request" — no NOT-NULL error), **Team** (upload a **photo per member**, pick **which services** each offers; "Save team & set individual hours" reveals per-staff hours), Photos, Contact/social, **Packages** (understandable copy), **Publish**.
- Regression check: **edit services after a booking exists** → past bookings must **keep their service name** (non-destructive save).

Owner panel (web `/panel` dashboard)
- Agenda/bookings; **Reschedule** (must land at the picked Mahé time, not browser tz); **Cancel** asks to confirm; **New walk-in appointment** (Mahé); **Block time** (calendar + form, both Mahé); **Clients** (import list, tags/notes); **Message clients** (must be **selectable recipients**, not auto-to-all; only the studio's own clients); Loyalty; Waitlist; **Classes** (create **recurring** series + capacity; shows booked / waiting counts).
- **Log out** works.

Owner PWA (pro)
- Log in with a studio-owner account → **lands directly on the pro dashboard** (no "client view" switch — it was removed).
- **Day agenda** strip (dots mark days with bookings), times in Mahé; tap a booking → **Reschedule / Cancel (confirm) / Call / Message on WhatsApp** (WhatsApp/Call appear only if the client left a phone; needs `+248…` international format). **Message clients** with checkboxes.

Commission & billing (logic, verify via a test booking + DB or admin)
- First-ever booking of a client at a studio → `is_new_client=true`, `commission_due = 20% × price`. An **imported "regular"** (in `client_notes`) booking for the first time → **no commission**. Owner walk-ins → no commission.
- Offer/billing: **3 months free, then €25/studio (incl. 1 staff) + €25 per extra staff (EUR)**. Confirm the panel/emails state EUR for subscription and SCR for services.

## 3) ADMIN / security

- **`/admin` + `/api/admin`:** confirm they are **NOT usable without** a valid `ADMIN_TOKEN` or admin-enrolled session (a random logged-in user must be rejected; unauthenticated → 401/403/503, never data).
- Admin actions: list studios/bookings/users; set studio status; mark paid; block/unblock; delete listing; import "pre-listed" prospect studios (for claiming).
- **RLS:** a client can read **only their own** bookings; an owner **only their own** studio's data; anon can read only public/active studios. Try to read another user's booking → must fail.
- **Secrets:** confirm no `SUPABASE_SERVICE_ROLE_KEY` / `BREVO_API_KEY` / tokens are exposed to the client bundle (grep built JS / network).
- **Cron** `/api/cron/reminders`: not triggerable by an anonymous caller.

---

## Report format
One table, most-severe first. Columns:
`Severity (H/M/L) | Persona | Surface (URL/screen) | Steps to reproduce | Expected | Actual | Screenshot`.
Group a short "invariant violations" section (currency / timezone / fake-data / false-promise / brand-link / mobile-overflow) separately. Don't fix — just report, unless told otherwise.

## Practical notes
- Prefer **read-only / non-destructive** checks; when a write is needed (booking, cancel, message), use **test data** and clean up.
- Note anything **stubbed/hidden on purpose** (PWA classes, online payment, push/SMS, wallet credit) as "by design", not a bug — unless it's presented to the user as working.
