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

## Kolejne sesje (żeby agent mógł pushować sam)
Następną sesję Claude Code otwórz **na repo `book-sey-la`** (nie na paczce Design) —
wtedy commity lecą prosto do repo, a Vercel deployuje automatycznie.
