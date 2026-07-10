"use client";
import React from "react";
import { Select } from "@/components/core/Select";

const TOPICS = ["General enquiry", "I run a studio", "Partnership", "Press", "Privacy / data request"];

export default function ContactPage() {
  const [form, setForm] = React.useState({ name: "", email: "", topic: TOPICS[0], message: "" });
  const [state, setState] = React.useState("idle"); // idle | sending | sent | error
  const [err, setErr] = React.useState("");
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setErr("");
    if (!form.name.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email) || !form.message.trim()) {
      setErr("Please fill in your name, a valid email and a message.");
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const j = await res.json().catch(() => ({}));
      if (res.ok && j.ok) {
        setState("sent");
      } else {
        setState("error");
        setErr(
          j.error === "not_configured"
            ? "Email isn't set up yet — please write to us at hello@sey.la in the meantime."
            : "Couldn't send your message. Please try again, or email hello@sey.la."
        );
      }
    } catch (e) {
      setState("error");
      setErr("Network error — please try again, or email hello@sey.la.");
    }
  }

  return (
    <>
      <header className="pg-nav">
        <div className="pg-nav-inner">
          <a className="pg-logo" href="/"><b>sey.la</b><span className="sep">|</span><i>book</i></a>
          <nav className="pg-nav-right">
            <a href="/search">Browse</a>
            <a href="/for-studios">For studios</a>
            <a className="pg-btn" href="/">Book now</a>
          </nav>
        </div>
      </header>

      <main>
        <div className="pg-wrap pg-wrap--wide">
          <section className="pg-hero">
            <div className="pg-eyebrow">Contact</div>
            <h1>Get in <em>touch</em></h1>
            <p className="lead">Questions, feedback, partnerships or press — we usually reply within 24 hours, island time.</p>
          </section>

          <section className="pg-contact">
            {state === "sent" ? (
              <div className="pg-form">
                <div className="pg-success" style={{ display: "block" }}>
                  <div className="tick">✓</div>
                  <h3 style={{ fontFamily: "var(--font-display)", color: "var(--cocoa)", margin: "0 0 6px" }}>Message sent</h3>
                  <p style={{ color: "var(--cocoa-60)", fontSize: "var(--text-sm)", margin: 0 }}>
                    Thanks for reaching out, {form.name.split(" ")[0] || "there"} — we'll get back to you within 24 hours. Please check your spam folder if you don't hear from us.
                  </p>
                </div>
              </div>
            ) : (
              <form className="pg-form" onSubmit={submit} noValidate>
                <div className="pg-fields">
                  <div className="pg-field">
                    <label htmlFor="c-name">Your name</label>
                    <input id="c-name" type="text" placeholder="Jane Doe" value={form.name} onChange={set("name")} required />
                  </div>
                  <div className="pg-field">
                    <label htmlFor="c-email">Email</label>
                    <input id="c-email" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} required />
                  </div>
                  <div className="pg-field">
                    <label htmlFor="c-topic">Topic</label>
                    <Select
                      value={form.topic}
                      onChange={(v) => setForm((f) => ({ ...f, topic: v }))}
                      options={TOPICS}
                      ariaLabel="Topic"
                      buttonStyle={{ padding: "12px 14px", fontWeight: 400, borderRadius: "var(--radius-md)", fontSize: "var(--text-body)" }}
                    />
                  </div>
                  <div className="pg-field">
                    <label htmlFor="c-msg">Message</label>
                    <textarea id="c-msg" placeholder="How can we help?" value={form.message} onChange={set("message")} required></textarea>
                  </div>
                  {err && <p style={{ color: "var(--clay)", fontSize: "var(--text-sm)", margin: 0 }}>{err}</p>}
                  <button type="submit" className="pg-btn" disabled={state === "sending"}>
                    {state === "sending" ? "Sending…" : "Send message"}
                  </button>
                </div>
              </form>
            )}

            <aside>
              <div className="pg-info-item">
                <div className="t">General enquiries</div>
                <div className="d"><a href="mailto:hello@sey.la">hello@sey.la</a></div>
              </div>
              <div className="pg-info-item">
                <div className="t">Privacy / data requests</div>
                <div className="d"><a href="mailto:privacy@sey.la">privacy@sey.la</a></div>
              </div>
              <div className="pg-info-item">
                <div className="t">Response time</div>
                <div className="d">Usually within 24 hours, Monday–Friday. Island time (UTC+4).</div>
              </div>
              <div className="pg-info-item">
                <div className="t">Operator</div>
                <div className="d">Nexora Consulting LLC<br />Sharjah Media City<br />Sharjah, United Arab Emirates</div>
              </div>
            </aside>
          </section>
        </div>
      </main>

      <footer className="pg-footer">
        <div className="pg-footer-inner">
          <a className="pg-logo" href="/"><b>sey.la</b><span className="sep">|</span><i>book</i></a>
          <nav className="pg-footer-nav">
            <a href="/">Home</a>
            <a href="/search">Browse</a>
            <a href="/for-studios">For studios</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
          </nav>
          <div className="pg-footer-copy">© 2026 sey.la · Operated by Nexora Consulting LLC, Sharjah Media City, UAE</div>
        </div>
      </footer>
    </>
  );
}
