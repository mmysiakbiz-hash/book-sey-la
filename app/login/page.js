"use client";
import React from "react";
import { Button } from "@/components/core/Button";
import { Input } from "@/components/core/Input";
import { Logo } from "@/components/brand/Logo";
import { sendMagicLink } from "@/lib/auth";

export default function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [state, setState] = React.useState("idle"); // idle | sending | sent | error
  const [msg, setMsg] = React.useState("");

  async function submit(e) {
    e.preventDefault();
    if (!email) return;
    setState("sending");
    const redirectTo = typeof window !== "undefined" ? window.location.origin + "/account" : undefined;
    const res = await sendMagicLink(email, redirectTo);
    if (res.error) {
      setState("error");
      setMsg(res.error === "supabase_not_configured"
        ? "Auth isn't configured yet (set the Supabase env vars)."
        : res.error);
    } else {
      setState("sent");
    }
  }

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "24px", background: "var(--bg-page)" }}>
      <div style={{ width: "100%", maxWidth: 380, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)", padding: "28px 26px" }}>
        <div style={{ marginBottom: 18 }}><Logo /></div>
        {state === "sent" ? (
          <>
            <h1 style={{ fontSize: "var(--text-h3)", margin: "0 0 8px" }}>Check your email</h1>
            <p style={{ color: "var(--text-muted)", margin: 0 }}>
              We sent a magic link to <b>{email}</b>. Open it on this device to sign in.
            </p>
          </>
        ) : (
          <>
            <h1 style={{ fontSize: "var(--text-h3)", margin: "0 0 4px" }}>Log in or sign up</h1>
            <p style={{ color: "var(--text-muted)", margin: "0 0 18px", fontSize: "var(--text-sm)" }}>
              We'll email you a magic link — no password needed.
            </p>
            <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
              <Input
                type="email"
                required
                placeholder="you@email.com"
                aria-label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" size="lg" disabled={state === "sending"}>
                {state === "sending" ? "Sending…" : "Send magic link"}
              </Button>
              {state === "error" && <p style={{ color: "var(--clay)", margin: 0, fontSize: "var(--text-sm)" }}>{msg}</p>}
            </form>
          </>
        )}
        <p style={{ marginTop: 18, fontSize: "var(--text-xs)", color: "var(--text-caption)" }}>
          Free for clients · always. <a href="/" style={{ color: "var(--accent-link)" }}>Back to home</a>
        </p>
      </div>
    </main>
  );
}
