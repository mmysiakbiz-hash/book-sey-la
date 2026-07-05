"use client";
import React from "react";
import { updateMyName } from "@/lib/auth";

// Lets a signed-in customer set the name studios see on their bookings.
export function AccountDetails({ user }) {
  const initial = (user && user.user_metadata && user.user_metadata.name) || "";
  const [name, setName] = React.useState(initial);
  const [state, setState] = React.useState("idle"); // idle | saving | saved | error
  React.useEffect(() => { setName(initial); }, [initial]);

  async function save() {
    setState("saving");
    const res = await updateMyName(name);
    setState(res && res.ok ? "saved" : "error");
    if (res && res.ok) setTimeout(() => setState("idle"), 1800);
  }

  const field = { flex: 1, minWidth: 180, boxSizing: "border-box", border: "1.5px solid var(--border)", borderRadius: "var(--radius-md)", padding: "11px 13px", font: "inherit", fontFamily: "var(--font-body)", color: "var(--cocoa)", background: "var(--surface)" };
  const btn = { background: "var(--clay)", color: "var(--surface)", border: "none", borderRadius: "var(--radius-pill)", padding: "11px 20px", fontFamily: "var(--font-body)", fontWeight: 600, cursor: "pointer" };

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-md)", padding: "16px 18px" }}>
      <p style={{ margin: "0 0 12px", color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>The name studios see on your bookings.</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <input style={field} placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") save(); }} />
        <button style={btn} onClick={save} disabled={state === "saving"}>{state === "saving" ? "Saving…" : "Save"}</button>
        {state === "saved" && <span style={{ color: "var(--eucalyptus)", fontWeight: 600, fontSize: "var(--text-sm)" }}>Saved</span>}
        {state === "error" && <span style={{ color: "var(--clay)", fontSize: "var(--text-sm)" }}>Couldn't save</span>}
      </div>
    </div>
  );
}
