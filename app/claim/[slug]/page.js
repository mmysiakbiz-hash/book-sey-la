"use client";
import React from "react";
import { Logo } from "@/components/brand/Logo";

// Claim a pre-listed studio: enter the email we have on file → get a sign-in
// link → take over (or delete) the listing from /panel.
export default function ClaimPage({ params }) {
  const slug = params.slug;
  const [ctx, setCtx] = React.useState(null); // { claimable, name, emailHint }
  const [email, setEmail] = React.useState("");
  const [state, setState] = React.useState("loading"); // loading | ready | notclaimable | sent | error
  const [err, setErr] = React.useState("");

  React.useEffect(() => {
    fetch(`/api/claim?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((j) => { setCtx(j); setState(j.claimable ? "ready" : "notclaimable"); })
      .catch(() => setState("error"));
  }, [slug]);

  async function start() {
    const addr = email.trim();
    if (!addr) return;
    setState("sending"); setErr("");
    try {
      const res = await fetch("/api/claim", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "start", slug, email: addr }),
      });
      const j = await res.json().catch(() => ({}));
      if (res.ok && j.ok) setState("sent");
      else {
        setState("ready");
        setErr(j.error === "email_mismatch" ? "That doesn't match the email we have on file for this studio. Try another, or contact hello@sey.la."
          : j.error === "not_claimable" ? "This studio has already been claimed."
          : "Something went wrong. Please try again.");
      }
    } catch (e) { setState("ready"); setErr("Network error. Try again."); }
  }

  const card = { width: "100%", maxWidth: 420, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)", padding: "28px 26px" };
  const field = { width: "100%", boxSizing: "border-box", border: "1.5px solid var(--border)", borderRadius: "var(--radius-md)", padding: "12px 14px", font: "inherit", fontFamily: "var(--font-body)", color: "var(--cocoa)", background: "var(--surface)" };
  const btn = { width: "100%", background: "var(--clay)", color: "var(--surface)", border: "none", borderRadius: "var(--radius-pill)", padding: "14px 22px", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "1.05rem", cursor: "pointer", marginTop: 14 };

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "var(--bg-page)" }}>
      <div style={card}>
        <div style={{ marginBottom: 18 }}><Logo /></div>

        {state === "loading" && <p style={{ color: "var(--text-muted)" }}>Loading…</p>}

        {state === "notclaimable" && (
          <>
            <h1 style={{ fontSize: "var(--text-h3)", margin: "0 0 8px" }}>Already on sey.la</h1>
            <p style={{ color: "var(--text-muted)", margin: 0 }}>This studio has already been claimed or isn't available to claim. If it's yours, <a href="/login" style={{ color: "var(--accent-link)" }}>log in</a>.</p>
          </>
        )}

        {state === "sent" && (
          <>
            <h1 style={{ fontSize: "var(--text-h3)", margin: "0 0 8px" }}>Check your email</h1>
            <p style={{ color: "var(--text-muted)", margin: 0 }}>We sent a sign-in link to <b>{email.trim()}</b>. Open it and you'll land on your studio — ready to finish your page or remove the listing.</p>
          </>
        )}

        {(state === "ready" || state === "sending") && ctx && (
          <>
            <h1 style={{ fontSize: "var(--text-h2)", margin: "0 0 6px" }}>Is this your studio?</h1>
            <p style={{ color: "var(--text-muted)", margin: "0 0 6px" }}>
              <b style={{ color: "var(--cocoa)" }}>{ctx.name || "This studio"}</b> has a pre-filled page on sey.la. Claim it to take over — it's free for your first 3 months.
            </p>
            {ctx.emailHint && <p style={{ color: "var(--text-caption)", fontSize: "var(--text-sm)", margin: "0 0 16px" }}>Verify with the email on file: <b>{ctx.emailHint}</b></p>}
            <input style={field} type="email" inputMode="email" placeholder="you@studio.com" value={email}
              onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") start(); }} />
            <button style={btn} onClick={start} disabled={state === "sending" || !email.trim()}>{state === "sending" ? "Sending…" : "Send me a claim link"}</button>
            {err && <p style={{ color: "var(--clay)", fontSize: "var(--text-sm)", margin: "10px 0 0" }}>{err}</p>}
          </>
        )}

        {state === "error" && <p style={{ color: "var(--clay)" }}>Couldn't load this studio. Try again later.</p>}
      </div>
    </main>
  );
}
