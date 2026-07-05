# sey.la | book — end-to-end test script for a Chrome browser agent

This is a ready-to-run test plan for an AI browser agent (e.g. Claude in Chrome)
that drives a real Chrome logged into the operator's Google account — so it can
click magic-link emails in Gmail and complete authenticated flows autonomously.

## Setup (fill these in before running)

- `BASE` = `https://book-sey-la.vercel.app`
- `EMAIL` = the Gmail address this Chrome is signed into (magic links land here).
- `ADMIN_TOKEN` = the value set in Vercel env (needed for the admin flow only).
- `CRON_SECRET` = the value set in Vercel env (needed to trigger reminders/reviews on demand).

Magic-link login (used throughout): after clicking **Send magic link** / **claim
link**, open a new tab → `https://mail.google.com` → open the newest email from
**sey.la (hello@sey.la)** → click the **Sign in** button → you return signed in.
Links are single-use and expire — request a fresh one if it fails.

---

## AGENT PROMPT (paste this into your Chrome agent)

> You are QA-testing a live web app, **sey.la | book** (`https://book-sey-la.vercel.app`).
> Work through the numbered scenarios in this document one by one. For each step,
> perform the action, then check the **Expect** line. Keep a running checklist and
> report at the end: for every step, PASS or FAIL with a one-line note and, on
> failure, a screenshot. Do not stop at the first failure — continue and report all.
>
> Auth: whenever a screen asks you to log in, use the email **{EMAIL}**, click
> **Send magic link**, then open Gmail in a new tab, open the newest **sey.la**
> email, and click the **Sign in** link. Come back and continue.
>
> Be gentle with real data: you may create test studios and bookings, but at the
> end list everything you created so it can be cleaned up. Never click
> "Disable JWT-based API keys" or any destructive account/billing settings.
> Values you'll need: ADMIN_TOKEN = **{ADMIN_TOKEN}**, CRON_SECRET = **{CRON_SECRET}**.

---

## Scenario A — ADMIN: generate a prospect page

1. Go to `{BASE}/admin/prospect`.
   **Expect:** a "New prospect page" form.
2. Paste `{ADMIN_TOKEN}` into **Admin token**. Fill **Studio name** = `QA Test Barber`,
   **Category** = `Barber`, **Island** = `Mahé`, **Address** = `Victoria, Mahé`,
   **Owner email** = `{EMAIL}`. Leave services/photos empty. Click **Create prospect page**.
   **Expect:** a green "Page ready 🎉" box with a **Public page** link and a **Claim link**.
3. Open the **Public page** link.
   **Expect:** a finished-looking barber page (hero photo, tagline, a services menu,
   opening hours). A banner says the studio **hasn't joined yet**, and service buttons
   say **"Claim to book"** (not "Book"). There is **no** "Classes" item in the top nav.
4. Note the two URLs for the next scenario.

## Scenario B — STUDIO: claim the listing, publish, tour the panel

1. Open the **Claim link** from Scenario A (`{BASE}/claim/qa-test-barber` or similar).
   **Expect:** "Is this your studio?" with a masked email hint and an email field.
2. Enter `{EMAIL}` → **Send me a claim link** → complete the magic-link login via Gmail.
   **Expect:** you land on **/panel** showing **"Your page is ready 🎉"** with a
   **Publish my page** button and a **"Delete — not interested"** banner. It should be
   pre-filled (name, services, hours) — NOT an empty step-1 form.
3. Click **Publish my page**.
   **Expect:** header changes to **"Live at /studio/…"**.
4. Click the tabs and verify each renders without error:
   - **Bookings** — empty state ("No bookings yet") since none exist.
   - **Classes** — an "Add a class" form + empty list.
   - **Billing** — a status banner (Free trial · N days left), plan showing **500 SCR / user**
     and **20% new-client commission**.
   - **Edit page** — the step wizard (Basics … Publish).
5. In **Classes**, add a class: name `Sunrise Beach Yoga`, pick a date a few days out,
   a time, capacity `8`, price `18`. Click **Add class**.
   **Expect:** it appears in the list as `0/8 booked`.
6. Open the public page `{BASE}/studio/qa-test-barber` in a new tab.
   **Expect:** now there **is** a "Classes" nav item, and a **Classes** section shows
   "Sunrise Beach Yoga" with **8 spots left** and a **Join** button.

## Scenario C — CLIENT: browse and book (real appointment)

1. As the client, open `{BASE}/studio/qa-test-barber`.
   **Expect:** the "Get directions" button in the hero is clearly readable (light/glass,
   not blended into the photo).
2. In **Services**, click **Book** on any service.
   **Expect:** a date/time picker opens, plus a **"With"** row to choose a team member
   or "Any professional".
3. Pick a day, a time, and a professional. If prompted to log in, complete the magic-link
   login. Click **Confirm booking**.
   **Expect:** a "Booked …" confirmation. (A confirmation email should arrive from sey.la —
   check Gmail.)
4. Go to `{BASE}/account`.
   **Expect:** sections for **Your details** (name field), **Your bookings** (the one you
   just made), **Wallet** (balance €0 with a hint), and **Invite a studio · €15**.
5. Set **Your name** = `QA Tester` → **Save**. **Expect:** "Saved".
6. Back on the studio page, click **Save** (heart) in the top bar. Return to `{BASE}/account`.
   **Expect:** a **Saved studios** section lists the studio.

## Scenario D — CLIENT: join a class

1. On `{BASE}/studio/qa-test-barber`, scroll to **Classes** → **Join** on the yoga class.
2. Enter a name and `{EMAIL}` → **Confirm spot**.
   **Expect:** "Booked" and the spots-left count drops to **7**. (Confirmation email in Gmail.)

## Scenario E — STUDIO owner: see the booking

1. Go to `{BASE}/panel` (still signed in as the owner) → **Bookings** tab.
   **Expect:** the appointment from Scenario C now appears under its day, showing the
   client name and service, with a **Cancel** action.

## Scenario F — Reviews (triggered on demand)

1. In a tab, open `{BASE}/api/cron/reminders?token={CRON_SECRET}`.
   **Expect:** a JSON `{ "ok": true, "results": [ … ] }`. (This also sends any due
   reminders / review requests.)
   *Note: a review request is only generated after an appointment's end time has passed,
   so this mainly verifies the endpoint runs; a fresh future booking won't produce one yet.*

## Scenario G — The mobile app (PWA)

1. Open `{BASE}/pwa/`.
   **Expect:** the mobile app UI loads (home with studios, a bottom tab bar:
   Home / Search / Bookings / Account). No blank screen / JS error.
2. Tap the **Account** tab.
   **Expect:** an **email** sign-in screen (magic link) — there is **no** phone-number field.
3. Tap **Search** and **Bookings** tabs. **Expect:** each renders content, no crash.

## Scenario H — "Not interested" cleanup path (optional)

1. Generate a second prospect page (Scenario A) with owner email `{EMAIL}`, claim it,
   and on the "Your page is ready" screen click **Delete — not interested**.
   **Expect:** the listing is removed from your panel; its public page no longer shows it.

---

## Report format

Return a table: Scenario · Step · PASS/FAIL · Note. Then a list of any studios/bookings
you created (names/slugs) for cleanup, and any screenshots of failures.
