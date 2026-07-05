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

## Kolejne sesje (żeby agent mógł pushować sam)
Następną sesję Claude Code otwórz **na repo `book-sey-la`** (nie na paczce Design) —
wtedy commity lecą prosto do repo, a Vercel deployuje automatycznie.
