"use client";
import React from "react";
import { Logo } from "@/components/brand/Logo";

// Public review submission page. Reached from the review-request email:
// /review/<bookingId>?t=<signed token>. No login — the token authorises it.
export default function ReviewPage({ params }) {
  const bookingId = params.bookingId;
  const [token, setToken] = React.useState("");
  const [ctx, setCtx] = React.useState(null); // { studioName, serviceName, alreadyReviewed }
  const [state, setState] = React.useState("loading"); // loading | ready | invalid | done | error
  const [rating, setRating] = React.useState(5);
  const [hover, setHover] = React.useState(0);
  const [text, setText] = React.useState("");
  const [name, setName] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("t") || "";
    setToken(t);
    if (!t) { setState("invalid"); return; }
    fetch(`/api/review?bookingId=${encodeURIComponent(bookingId)}&token=${encodeURIComponent(t)}`)
      .then((r) => r.json())
      .then((j) => {
        if (!j.ok) { setState("invalid"); return; }
        setCtx(j);
        if (j.guestName) setName(j.guestName);
        setState(j.alreadyReviewed ? "done" : "ready");
      })
      .catch(() => setState("error"));
  }, [bookingId]);

  async function submit() {
    setBusy(true);
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ bookingId, token, rating, text, guestName: name }),
      });
      const j = await res.json().catch(() => ({}));
      if (res.ok && j.ok) setState("done");
      else if (j.error === "already_reviewed") setState("done");
      else setState("error");
    } catch (e) { setState("error"); }
    setBusy(false);
  }

  const card = { width: "100%", maxWidth: 420, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)", padding: "28px 26px" };

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "var(--bg-page)" }}>
      <div style={card}>
        <div style={{ marginBottom: 18 }}><Logo /></div>

        {state === "loading" && <p style={{ color: "var(--text-muted)", margin: 0 }}>Loading…</p>}

        {state === "invalid" && (
          <>
            <h1 style={{ fontSize: "var(--text-h3)", margin: "0 0 8px" }}>Link expired</h1>
            <p style={{ color: "var(--text-muted)", margin: 0 }}>This review link isn't valid anymore. If you'd still like to leave a review, reply to your confirmation email.</p>
          </>
        )}

        {state === "error" && (
          <>
            <h1 style={{ fontSize: "var(--text-h3)", margin: "0 0 8px" }}>Something went wrong</h1>
            <p style={{ color: "var(--text-muted)", margin: 0 }}>Please try again in a moment.</p>
          </>
        )}

        {state === "done" && (
          <>
            <h1 style={{ fontSize: "var(--text-h3)", margin: "0 0 8px" }}>Thank you 🌴</h1>
            <p style={{ color: "var(--text-muted)", margin: 0 }}>Your review helps other islanders find great studios. See you next time.</p>
          </>
        )}

        {state === "ready" && (
          <>
            <h1 style={{ fontSize: "var(--text-h3)", margin: "0 0 4px" }}>How was your visit?</h1>
            <p style={{ color: "var(--text-muted)", margin: "0 0 18px", fontSize: "var(--text-sm)" }}>
              {ctx && ctx.serviceName ? ctx.serviceName : "Your appointment"}{ctx && ctx.studioName ? ` · ${ctx.studioName}` : ""}
            </p>

            <div role="radiogroup" aria-label="Rating" style={{ display: "flex", gap: 6, marginBottom: 16 }}>
              {[1, 2, 3, 4, 5].map((n) => {
                const on = (hover || rating) >= n;
                return (
                  <button key={n} type="button" aria-label={`${n} star${n > 1 ? "s" : ""}`} aria-checked={rating === n} role="radio"
                    onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)} onClick={() => setRating(n)}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 2, fontSize: 30, lineHeight: 1, color: on ? "var(--brass, #C79A3B)" : "var(--line-strong, #d9d4cf)" }}>
                    ★
                  </button>
                );
              })}
            </div>

            <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4}
              placeholder="What stood out? (optional)"
              style={{ width: "100%", boxSizing: "border-box", resize: "vertical", border: "1.5px solid var(--border)", borderRadius: "var(--radius-md)", padding: "12px 14px", font: "inherit", fontFamily: "var(--font-body)", color: "var(--cocoa)", background: "var(--surface)", marginBottom: 12 }} />

            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name (optional)"
              style={{ width: "100%", boxSizing: "border-box", border: "1.5px solid var(--border)", borderRadius: "var(--radius-md)", padding: "12px 14px", font: "inherit", fontFamily: "var(--font-body)", color: "var(--cocoa)", background: "var(--surface)", marginBottom: 16 }} />

            <button onClick={submit} disabled={busy}
              style={{ width: "100%", background: "var(--clay)", color: "var(--surface)", border: "none", borderRadius: "var(--radius-pill)", padding: "14px 22px", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "1.05rem", cursor: "pointer" }}>
              {busy ? "Sending…" : "Submit review"}
            </button>
          </>
        )}

        <p style={{ marginTop: 18, fontSize: "var(--text-xs)", color: "var(--text-caption)" }}>
          <a href="/" style={{ color: "var(--accent-link)" }}>sey.la | book</a>
        </p>
      </div>
    </main>
  );
}
