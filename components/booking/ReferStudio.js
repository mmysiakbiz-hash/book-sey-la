"use client";
import React from "react";
import { getMyReferrals, createReferral } from "@/lib/referrals";

// Invite a studio → €15 credit for both once they go live. Self-loads the
// caller's referrals (RLS referrals_self).
export function ReferStudio() {
  const [email, setEmail] = React.useState("");
  const [list, setList] = React.useState([]);
  const [state, setState] = React.useState("idle"); // idle | sending | error
  const [msg, setMsg] = React.useState("");

  const load = React.useCallback(() => { getMyReferrals().then(setList); }, []);
  React.useEffect(() => { load(); }, [load]);

  async function invite() {
    const addr = email.trim();
    if (!addr) return;
    setState("sending"); setMsg("");
    const res = await createReferral(addr);
    if (res.ok) { setEmail(""); setState("idle"); load(); }
    else {
      setState("error");
      setMsg(res.error === "already_invited" ? "You've already invited that studio."
        : res.error === "cannot_refer_yourself" ? "That's your own email."
        : res.error === "invalid_email" ? "Enter a valid email."
        : "Couldn't send the invite. Try again.");
    }
  }

  const inp = { flex: 1, minWidth: 180, boxSizing: "border-box", border: "1.5px solid var(--border)", borderRadius: "var(--radius-md)", padding: "11px 13px", font: "inherit", fontFamily: "var(--font-body)", color: "var(--cocoa)", background: "var(--surface)" };
  const btn = { background: "var(--clay)", color: "var(--surface)", border: "none", borderRadius: "var(--radius-pill)", padding: "11px 20px", fontFamily: "var(--font-body)", fontWeight: 600, cursor: "pointer" };

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-md)", padding: "16px 18px" }}>
      <p style={{ margin: "0 0 12px", color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>
        Know a great salon, spa or barber? Invite them — when they go live, you both get <b style={{ color: "var(--cocoa)" }}>€15</b> in credit.
      </p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input style={inp} type="email" inputMode="email" placeholder="studio@email.com" value={email}
          onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") invite(); }} />
        <button style={btn} onClick={invite} disabled={state === "sending" || !email.trim()}>{state === "sending" ? "Sending…" : "Send invite"}</button>
      </div>
      {state === "error" && <p style={{ color: "var(--clay)", fontSize: "var(--text-sm)", margin: "8px 0 0" }}>{msg}</p>}

      {list.length > 0 && (
        <div style={{ display: "grid", gap: 8, marginTop: 14, borderTop: "1px solid var(--line)", paddingTop: 12 }}>
          {list.map((r) => (
            <div key={r.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: "var(--text-sm)" }}>
              <span style={{ color: "var(--cocoa)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.referred_email}</span>
              <span style={{ fontWeight: 600, color: r.status === "completed" ? "var(--confirmed)" : "var(--text-muted)" }}>
                {r.status === "completed" ? `+€${Math.round(r.credit_eur || 15)} earned` : "Invited · pending"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
