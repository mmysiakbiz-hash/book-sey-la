# Deploy book-sey-la (bez terminala — sama przeglądarka)

## 1. Wrzuć kod na GitHub (upload przez web)
1. Otwórz puste repo: https://github.com/mmysiakbiz-hash/book-sey-la
2. Kliknij **"uploading an existing file"** (link na stronie pustego repo).
3. Przeciągnij **wszystkie pliki i foldery z tej paczki** do pola upload:
   `app/`, `components/`, `lib/`, `public/`, `package.json`, `package-lock.json`,
   `next.config.mjs`, `jsconfig.json`, `.gitignore`, `.env.example`, `README.md`, `DEPLOY.md`.
   (NIE ma tu `node_modules/` ani `.next/` — i dobrze, nie wrzucaj ich.)
4. Na dole kliknij **Commit changes** (do gałęzi `main`).

> Gdyby GitHub nie przyjął wszystkiego za jednym razem, wrzuć w dwóch turach
> (najpierw foldery `app/ components/ lib/ public/`, potem pliki z korzenia).

## 2. Deploy na Vercel
1. Wejdź na https://vercel.com/new → **Import Git Repository** → wybierz `book-sey-la`.
2. Framework: **Next.js** (wykryje sam). **Root Directory: zostaw `./`** (kod jest w korzeniu).
3. **Environment Variables** — dodaj trzy:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://eoapvjnaievxqkbmtxar.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `sb_publishable_tZhLyNftU_iSMfZnu5NyOQ_Ht2h2GN6`
   - `BREVO_API_KEY` = *(Twój klucz API z Brevo — SMTP & API → API Keys)*  ← sekret, bez `NEXT_PUBLIC_`
4. **Deploy**. Skopiuj adres, który poda Vercel (np. `https://book-sey-la.vercel.app`).

## 3. Supabase — redirect dla magic-link (logowanie)
Supabase → **Authentication → URL Configuration**:
- **Site URL:** `https://<twój-adres>.vercel.app`
- **Redirect URLs:** `https://<twój-adres>.vercel.app/**`
- (jeśli testujesz lokalnie, dodaj też `http://localhost:3000/**`)

Bez tego magic-link nie wróci do aplikacji.

## Co działa po deployu
- Listy lokali + strona lokalu czytają na żywo z Supabase.
- Logowanie (magic-link, mail z `hello@sey.la` przez Brevo SMTP).
- Rezerwacja na stronie lokalu → zapis do bazy + mail potwierdzający (Brevo API).

## 4. Dostarczalność maili (KRYTYCZNE — bez tego nie przyjdzie ani magic-link, ani potwierdzenie)

Są **dwie** ścieżki maili i obie zależą od **zweryfikowanego nadawcy w Brevo**:
- **Magic-link (logowanie)** = Supabase Auth → wysyłka przez **Brevo SMTP**.
- **Potwierdzenie rezerwacji** = nasz `/api/book` → **Brevo API** (`BREVO_API_KEY`).

### 4a. Brevo — zweryfikuj nadawcę / domenę (robisz raz)
Brevo → **Senders, Domains & Dedicated IPs**:
- **Senders** → dodaj i potwierdź `hello@sey.la` (klik w mail potwierdzający), **albo**
- **Domains** → dodaj `sey.la` i ustaw rekordy **SPF + DKIM** (i DMARC) w DNS. To najważniejszy krok — bez tego Brevo odrzuca wysyłkę ("sender not valid") i maile nie wychodzą.

### 4b. Szybki test end-to-end (bez zgadywania)
Po deployu i ustawieniu `BREVO_API_KEY`:
1. Sprawdź konfigurację: otwórz `https://<adres>/api/health/email` — powinno być `"brevoConfigured": true`.
2. Ustaw w Vercel zmienną `EMAIL_TEST_TOKEN` (dowolny sekret), redeploy.
3. Wyślij testowy mail:
   `https://<adres>/api/health/email?to=twoj@mail.com&token=<EMAIL_TEST_TOKEN>`
   - `"sent": true` → API + nadawca OK (magic-link i potwierdzenia też zadziałają).
   - `"result.error": "brevo_400: ... sender ..."` → wróć do **4a** (nadawca niezweryfikowany).
   - `"brevoConfigured": false` → brak/zły `BREVO_API_KEY` w Vercel.

### 4c. Magic-link przez Brevo API (zalecane — bez Supabase SMTP)
Magic-link logowania jest wysyłany przez **nasz** endpoint `/api/auth/magic-link`
(generuje link Supabase Admin API i wysyła go **Brevo API** — tą samą działającą
ścieżką co potwierdzenia). Dzięki temu **nie** trzeba konfigurować Supabase Custom SMTP.
- W Vercel dodaj sekret **`SUPABASE_SERVICE_ROLE_KEY`** (Supabase → Project Settings →
  API → `service_role`). Server-only, nigdy `NEXT_PUBLIC`. Redeploy.
- Sprawdź `https://<adres>/api/health/email` → `"serviceRoleConfigured": true`.
- Redirecty muszą być na liście (pkt 3): Supabase → Auth → URL Configuration.
- Jeśli klucz nie jest ustawiony, kod **automatycznie** wraca do wbudowanego
  Supabase signInWithOtp (patrz 4d), więc nic się nie psuje.

### 4d. (Alternatywa) Supabase — Custom SMTP
Tylko jeśli NIE chcesz używać `SUPABASE_SERVICE_ROLE_KEY`. Supabase →
**Authentication → Emails → SMTP Settings** → **Enable Custom SMTP**:
- Host: `smtp-relay.brevo.com`, Port: `587`
- User: login SMTP z Brevo (**SMTP & API → SMTP**), Password: klucz **SMTP** (nie API key)
- Sender email: `hello@sey.la`, Sender name: `sey.la | book` → **Save**.
- Sprawdź też **Authentication → Rate Limits** i **Logs → Auth** (błędy SMTP).

Diagnostyka: jeśli **4b** działa (Brevo API OK), a magic-link nadal nie przychodzi,
sprawdź czy `serviceRoleConfigured` = true (4c) oraz redirecty/URL-config (pkt 3).

## 5. Przypomnienia 24h / 2h (cron)
Endpoint `GET /api/cron/reminders` wysyła przypomnienia (Brevo) o rezerwacjach
zaczynających się za ~24h i ~2h i ustawia flagi `reminded_24h/2h` (nie zdubluje).
- W Vercel dodaj sekret **`CRON_SECRET`** (dowolny losowy ciąg). Wymaga też
  `SUPABASE_SERVICE_ROLE_KEY` i `BREVO_API_KEY` (już z pkt 4).
- Harmonogram w `vercel.json` to `0 7 * * *` (raz dziennie) — **Hobby/Free
  wymaga cronów max raz na dobę; harmonogram częstszy niż dobowy powoduje błąd
  deploya i Vercel przestaje budować.** Nie zmieniaj na częstszy, dopóki nie masz Pro.
- Dla realnych przypomnień 24h/2h (częstszych) wskaż darmowy scheduler
  (np. cron-job.org) na `https://<adres>/api/cron/reminders?token=<CRON_SECRET>`
  co godzinę — działa niezależnie od planu Vercel. Na Pro możesz wrócić do `0 * * * *`.
- Test ręczny: `https://<adres>/api/cron/reminders?token=<CRON_SECRET>` →
  `{ "ok": true, "results": [ {24h}, {2h}, {review_request} ] }`.

## 6. Recenzje (po wizycie)
Ten sam cron (`/api/cron/reminders`) wysyła też **prośbę o recenzję** po wizycie
(mail z podpisanym linkiem `/review/<id>?t=...`). Gość wystawia ocenę bez logowania;
zapis idzie przez `/api/review` (service role — tabela `reviews` nie ma polityki
INSERT dla klienta). Recenzje pokazują się na stronie lokalu (sekcja „reviews").
- Wymaga `SUPABASE_SERVICE_ROLE_KEY` + `BREVO_API_KEY`. Token linku podpisywany
  `REVIEW_SECRET` (albo `CRON_SECRET`, jeśli `REVIEW_SECRET` nie ustawisz).
- Nic dodatkowego do klikania — działa razem z crona z pkt 5.

## 7. Konfigurator salonu (self-service)
Właściciel wchodzi na **`/panel`**, loguje się (magic-link) i przechodzi kreator:
podstawy → opis → lokalizacja → godziny → usługi → zespół → zdjęcia → social →
publikacja. „Publish" ustawia status `active` i strona jest **od razu live** pod
`/studio/<slug>`. Zapisy idą na sesji właściciela (RLS `owns_studio`) — nie trzeba
service-role. Zdjęcia lądują w publicznym buckecie `studio-photos`.
- Wymaga tylko `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  (magic-link działa przez `/api/auth/magic-link` — patrz pkt 4c).
- `verified` to teraz osobna odznaka (Twoja moderacja) — nie blokuje publikacji.

## 8. Billing (na razie zaślepka Stripe)
Model: **3 miesiące gratis** od rejestracji salonu (`studios.trial_ends_at`), potem
**500 SCR za użytkownika** (właściciel = pierwszy użytkownik, +500 za każdego
pracownika → 500 × max(1, pracownicy)) **plus 20% prowizji od pierwszej rezerwacji
pozyskanego klienta** (`bookings.commission_due`; stali klienci wgrani przez salon
mają już historię, więc bez prowizji). **14 dni** na wpłatę, a po tym okresie konto
zostaje **zablokowane** (`billing_blocked=true` → salon znika z publicznej strony;
właściciel dalej ma dostęp do `/panel`).
- Właściciel widzi status w `/panel → Billing` (trial/termin/kwota/grace). Przycisk
  płatności to **placeholder** („coming soon") — realny Stripe dojdzie później.
- Blokadę po przekroczeniu grace robi dzienny cron (`/api/cron/reminders`,
  funkcja billing) + mail do właściciela. Bez Stripe „opłacenie" ustawia się na
  razie ręcznie: `update studios set paid_until = now() + interval '1 month',
  billing_blocked=false where id=…` (albo docelowo webhook Stripe).
- Gdy dojdzie Stripe: `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` w Vercel,
  webhook ustawia `paid_until`/`stripe_*` i zdejmuje `billing_blocked`.

## 9. Domena book.sey.la przez Cloudflare
`sey.la` (DNS w Cloudflare) hostuje inny projekt — pod Cloudflare wpinamy **tylko
subdomenę `book.sey.la`**, nie ruszając rekordów roota.
1. **Vercel** → projekt `book-sey-la` → Settings → Domains → **Add** `book.sey.la`.
   Vercel poda cel CNAME (zwykle `cname.vercel-dns.com`).
2. **Cloudflare** (strefa `sey.la`) → DNS → dodaj rekord:
   - Type **CNAME**, Name **book**, Target **cname.vercel-dns.com**,
     Proxy **ON** (pomarańczowa chmurka). Zostaw wszystkie inne rekordy roota bez zmian.
3. **Cloudflare → SSL/TLS → Overview → tryb `Full (strict)`** (KONIECZNIE — przy
   „Flexible" będzie pętla przekierowań z Vercelem).
4. Poczekaj aż w Vercel przy `book.sey.la` będzie **„Valid Configuration"**.
   (Opcjonalnie ustaw `book.sey.la` jako **Production domain** w Vercel.)
5. **Supabase → Authentication → URL Configuration**: dodaj
   `https://book.sey.la` (Site URL) i `https://book.sey.la/**` (Redirect URLs),
   żeby magic-link wracał na nową domenę. Zostaw też adresy `*.vercel.app`.
- Kod nie wymaga zmian: redirecty liczą się z `window.location.origin`, więc
  działają automatycznie na `book.sey.la` po dodaniu do allow-listy w pkt 5.

## 10. Generator stron pod prospekta (`/admin/prospect`)
Szybkie tworzenie gotowej strony `unclaimed` pod jeden salon (do wysłania w
sprzedaży). Wymaga sekretu **`ADMIN_TOKEN`** w Vercel.
- Wejdź na `https://<adres>/admin/prospect`, wklej `ADMIN_TOKEN` (zapamięta się),
  podaj nazwę + kategorię (reszta z presetów: zdjęcia, opis, menu, godziny),
  opcjonalnie miasto/mail/usługi/zdjęcia → dostajesz **link publiczny** (podgląd)
  i **link do przejęcia** (`/claim/<slug>`) do wysłania właścicielowi.
- Właściciel podaje mail zbieżny z tym, który wpiszesz → link logujący → ląduje
  na „Twoja strona gotowa → Opublikuj" (jedno kliknięcie), albo „Usuń — nie jestem
  zainteresowany". Booking działa dopiero po przejęciu.

## Kolejne sesje (żeby agent mógł pushować sam)
Następną sesję Claude Code otwórz **na repo `book-sey-la`** (nie na paczce Design) —
wtedy commity lecą prosto do repo, a Vercel deployuje automatycznie.
