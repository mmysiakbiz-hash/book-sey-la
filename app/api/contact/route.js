// POST /api/contact — the public contact form. Emails the submission to the
// support inbox via Brevo. No auth (public form) with light validation and a
// hard cap on message length so it can't be abused as a relay.
//
//   { name, email, topic, message } → { ok }
import { NextResponse } from "next/server";
import { sendBrevoEmail, hasBrevo, SENDER } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SUPPORT_INBOX = "hello@sey.la";
const isEmail = (e) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);
const esc = (s) =>
  String(s || "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

export async function POST(req) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  const name = String(body.name || "").trim().slice(0, 120);
  const email = String(body.email || "").trim().slice(0, 200);
  const topic = String(body.topic || "General enquiry").trim().slice(0, 80);
  const message = String(body.message || "").trim().slice(0, 4000);

  if (!name || !isEmail(email) || !message) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }
  if (!hasBrevo()) {
    // Don't 500 the user — log it so nothing is silently lost.
    console.error("[contact] BREVO_API_KEY not set — message from", email, "not delivered:", message.slice(0, 200));
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const html = `<!doctype html><html><body style="margin:0;background:#F5F4F1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5F4F1;padding:28px 16px"><tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#FFFFFF;border:1px solid #E9E5E0;border-radius:16px;overflow:hidden">
      <tr><td style="padding:22px 26px 6px"><div style="font-size:16px;color:#23201E"><b>sey.la</b> <span style="color:#9A938D">|</span> book · contact form</div></td></tr>
      <tr><td style="padding:6px 26px 4px"><h1 style="margin:0;font-size:20px;color:#23201E">${esc(topic)}</h1></td></tr>
      <tr><td style="padding:10px 26px 4px;color:#47423F;font-size:15px;line-height:1.5">
        <p style="margin:0 0 4px"><b>From:</b> ${esc(name)} &lt;${esc(email)}&gt;</p>
        <p style="margin:14px 0 0;white-space:pre-wrap">${esc(message)}</p>
      </td></tr>
      <tr><td style="padding:18px 26px 26px"><p style="margin:0;color:#6E6863;font-size:13px">Reply directly to ${esc(email)}.</p></td></tr>
    </table>
  </td></tr></table></body></html>`;

  const r = await sendBrevoEmail({
    to: SUPPORT_INBOX,
    toName: "sey.la support",
    subject: `Contact · ${topic} · ${name}`,
    html,
  });
  if (r.error) return NextResponse.json({ error: "send_failed" }, { status: 502 });
  return NextResponse.json({ ok: true });
}
