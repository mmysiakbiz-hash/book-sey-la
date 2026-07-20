# book.sey.la — Admin panel QA brief (paste to a Cowork agent)

Goal: exercise the **admin** surface end-to-end as the platform operator, verify every
number and action, and report defects. Drive a real browser (Playwright/Chromium) at
desktop width (≥1200px). Report findings as: `Severity (H/M/L) | Screen | Steps | Expected | Actual | Screenshot`.

## Access (arrange before testing)
- Admin URL: `https://book.sey.la/admin` (and `https://book.sey.la/admin/prospect`).
- The gate accepts **either** an admin-enrolled session **or** a pasted `ADMIN_TOKEN`.
- The enrolled admin account is **m.mysiakbiz@gmail.com** — sign in with its magic link
  (you need read access to that mailbox). Prefer this over the token so you also test the
  session path. If you only have the token, use the "ADMIN_TOKEN" field on the gate.
- **Do not** sign out at the end (leave the session intact). **Do not** delete real
  studios/bookings or send prospect emails to real addresses.

## Global invariants to assert on every admin screen
- **Currency split:** `MRR (subscriptions)` is **EUR (€)**; `Commission`, `GMV`,
  `Wallet credit out`, and every per-booking/user amount are **SCR**. No mix-ups.
- **Timezone:** all booking timestamps render in **Mahé (UTC+4)**.
- **No secret leakage:** view-source / network must never expose `SERVICE_ROLE`,
  `BREVO_API_KEY`, `ADMIN_TOKEN`, `CRON_SECRET`. All admin reads/writes go through the
  server (`/api/admin`) with the session/token — the browser never holds a service key.
- **Auth gate holds:** in a fresh incognito window, `/admin` and `/admin/prospect` must
  NOT show data without a valid session/token (expect the gate, not a flash of numbers).

## 1) Gate / auth
- Incognito → `/admin`: gate shows, no data leaks. Wrong token → clear error, no access.
- Magic-link path: request link as m.mysiakbiz@gmail.com, open it → lands in the dashboard.
- After entering, "Sign out" clears access (then sign back in to continue — see caveat above).

## 2) Overview (BI) — verify numbers against reality
Tabs live at the top: **Overview · Studios · Bookings · Users**.
- Period selector (All / 7d / 30d / 90d): switching updates period-scoped metrics; note the
  copy "Studios & MRR are always current; other metrics use the period" — verify MRR and
  Studios do NOT change with the period, but Bookings/GMV/Commission DO.
- Cross-check each stat against the Studios/Bookings/Users tabs (and flag any mismatch):
  - **Studios** total vs the sublabels (live / unclaimed / draft) — should add up.
  - **MRR (€)** = €25 × billed team members across live studios. Spot-check: pick a live
    studio, count its team members, confirm the contribution is €25 × members.
  - **Commission (SCR)** and **new_clients** — every "new" booking in the Bookings tab
    should carry a commission; imported/regular clients should not.
  - **GMV (SCR)** ≈ sum of booked prices; **Bookings** total vs cancelled count.
  - **Wallet credit out (SCR)**, **Referrals** (paid vs pending), **Reviews** (+avg ★).
- Bookings chart (last 14 days): bars match the Bookings tab volume; empty state honest.
- **FALSE-DATA CHECK:** no invented metrics — a metric with no data shows 0 / "—", not a
  made-up number.

## 3) Studios tab
- Search by name/email filters the list.
- **Status** dropdown: change a **test** studio's status (e.g. draft ↔ active) → persists on
  reload; confirm the public page visibility matches (active = listed, draft/unclaimed = not).
- **Mark paid** on a test studio → billing date advances / blocked clears (check Billing).
- **Block** → the studio's public page is hidden and its owner sees the suspended banner;
  **Unblock** reverses it. (Use a **test** studio only.)
- **Delete**: only on a throwaway test studio — confirm it's removed and its bookings/services
  go with it (or are handled cleanly, no orphan rows surfacing elsewhere).
- **Export CSV**: downloads, columns match (Name, Slug, Status, Owner, Created, Blocked).
- Studio name links to `/studio/[slug]` in a new tab.

## 4) Bookings tab
- Timestamps in Mahé; each row shows studio · service · client, price in **SCR**, and
  `+SCR N comm` only for new-client bookings; "new" tag present where expected.
- **Cancel** a test booking → status flips to cancelled, the Cancel button disappears,
  Overview counts update on reload.
- **Complete** a confirmed test booking → status → completed.
- Export CSV columns match (When, Studio, Service, Client, Price, Commission, New, Status).

## 5) Users tab
- Lists users with **bookings** count, **SCR wallet** balance, and an "owner" badge where
  the user owns a studio. Spot-check one user's booking count against the Bookings tab.
- Export CSV (Email, Created, Bookings, Wallet, Owns).
- **PII note:** confirm this is admin-only (the gate already covers it) — these are real
  emails; do not export/share them outside the test.

## 6) Prospect tool (`/admin/prospect`)
- Gated by ADMIN_TOKEN (remembered locally). With a valid token the form loads.
- Create a prospect page for a **fake** studio (e.g. "ZZ Test Prospect") — verify it saves
  and the generated claim/prospect page renders. **Do not** trigger any email to a real
  address. Clean up the test prospect afterwards if a delete path exists (else report that
  none exists).

## 7) Security spot-checks (report as H if any fail)
- With NO auth (incognito, no token): calls behind the admin screens (`/api/admin…`) must
  return 401/403, never data. Try hitting them directly.
- No admin-only RPC (`admin_bi`, `due_reminders`, etc.) is callable by an anonymous
  Supabase client (these were locked down — confirm they still are).

## Cleanup
- Revert any status you changed on a real studio; cancel/delete only test rows you created;
  remove the test prospect. List anything you couldn't clean via the UI (needs DB removal).
- Report which of these sections you actually completed vs skipped, so a gap isn't read as a pass.
