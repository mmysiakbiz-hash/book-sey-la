// Brevo (transactional email) — SERVER ONLY. Never import into client components.
// Requires BREVO_API_KEY (server env, NOT NEXT_PUBLIC). Sender is verified in Brevo.
const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";
export const SENDER = { email: "hello@sey.la", name: "sey.la | book" };

export function hasBrevo() {
  return Boolean(process.env.BREVO_API_KEY);
}

export async function sendBrevoEmail({ to, toName, subject, html }) {
  const key = process.env.BREVO_API_KEY;
  if (!key) return { error: "brevo_not_configured" };
  if (!to) return { error: "missing_recipient" };
  try {
    const res = await fetch(BREVO_ENDPOINT, {
      method: "POST",
      headers: { "api-key": key, "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        sender: SENDER,
        to: [{ email: to, name: toName || undefined }],
        subject,
        htmlContent: html,
      }),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      // Surface the failure in server logs (Vercel) so deliverability issues are visible.
      const err = `brevo_${res.status}: ${t.slice(0, 300)}`;
      console.error("[email] Brevo send failed:", err);
      return { error: err };
    }
    // Brevo returns { messageId } on success — keep it for traceability.
    const data = await res.json().catch(() => ({}));
    return { ok: true, messageId: data && data.messageId };
  } catch (e) {
    console.error("[email] Brevo fetch failed:", e && e.message);
    return { error: "brevo_fetch_failed" };
  }
}

// Owner notice: account suspended for non-payment.
export function billingBlockedEmail({ studioName }) {
  const subject = `Action needed · your sey.la page is paused${studioName ? " · " + studioName : ""}`;
  const html = `<!doctype html><html><body style="margin:0;background:#F5F4F1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5F4F1;padding:28px 16px"><tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#FFFFFF;border:1px solid #E9E5E0;border-radius:16px;overflow:hidden">
      <tr><td style="padding:24px 26px 8px"><div style="font-size:17px;color:#23201E"><b>sey.la</b> <span style="color:#9A938D">|</span> book</div></td></tr>
      <tr><td style="padding:8px 26px 4px"><h1 style="margin:0;font-size:22px;color:#23201E">Your page is paused</h1>
        <p style="margin:8px 0 0;color:#47423F;font-size:15px;line-height:1.5">Your free period plus the 14-day grace window has ended without payment, so ${studioName || "your studio"} is now hidden from clients. Add payment in your dashboard to go live again — your setup is safe.</p></td></tr>
      <tr><td style="padding:18px 26px 26px"><p style="margin:0;color:#6E6863;font-size:13px;line-height:1.5">Questions? Just reply to this email.</p></td></tr>
    </table>
    <p style="max-width:480px;margin:16px auto 0;color:#9A938D;font-size:12px;text-align:center">sey.la | book · beauty &amp; wellness across the Seychelles</p>
  </td></tr></table></body></html>`;
  return { subject, html };
}

// Branded magic-link / sign-in email. `actionLink` is the Supabase verify URL.
export function magicLinkEmail({ actionLink }) {
  const subject = "Your sey.la sign-in link";
  const html = `<!doctype html><html><body style="margin:0;background:#F5F4F1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5F4F1;padding:28px 16px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#FFFFFF;border:1px solid #E9E5E0;border-radius:16px;overflow:hidden">
        <tr><td style="padding:24px 26px 8px">
          <div style="font-size:17px;color:#23201E"><b>sey.la</b> <span style="color:#9A938D">|</span> book</div>
        </td></tr>
        <tr><td style="padding:8px 26px 4px">
          <h1 style="margin:0;font-size:22px;color:#23201E">Sign in to sey.la</h1>
          <p style="margin:8px 0 0;color:#47423F;font-size:15px;line-height:1.5">Tap the button below to sign in. No password needed — booking is always free.</p>
        </td></tr>
        <tr><td style="padding:20px 26px 6px">
          <a href="${actionLink}" style="display:inline-block;background:#23201E;color:#FFFFFF;text-decoration:none;font-size:15px;font-weight:600;padding:13px 22px;border-radius:999px">Sign in</a>
        </td></tr>
        <tr><td style="padding:14px 26px 26px">
          <p style="margin:0;color:#6E6863;font-size:13px;line-height:1.5">Or paste this link into your browser:<br><a href="${actionLink}" style="color:#6E6863;word-break:break-all">${actionLink}</a></p>
          <p style="margin:12px 0 0;color:#9A938D;font-size:12px;line-height:1.5">If you didn't request this, you can safely ignore it. The link expires shortly.</p>
        </td></tr>
      </table>
      <p style="max-width:480px;margin:16px auto 0;color:#9A938D;font-size:12px;text-align:center">sey.la | book · beauty &amp; wellness across the Seychelles</p>
    </td></tr>
  </table></body></html>`;
  return { subject, html };
}

// Branded appointment reminder. kind = "24h" | "2h".
export function bookingReminderEmail({ studioName, serviceName, whenText, kind }) {
  const lead = kind === "2h"
    ? "Your appointment is in about 2 hours. See you soon 🌴"
    : "Just a reminder — your appointment is tomorrow. See you soon 🌴";
  const subject = kind === "2h"
    ? `Reminder · your appointment is soon${studioName ? " · " + studioName : ""}`
    : `Reminder · your appointment tomorrow${studioName ? " · " + studioName : ""}`;
  const row = (label, value) =>
    value
      ? `<tr><td style="padding:6px 0;color:#6E6863;font-size:14px">${label}</td><td style="padding:6px 0;color:#23201E;font-size:14px;font-weight:600;text-align:right">${value}</td></tr>`
      : "";
  const html = `<!doctype html><html><body style="margin:0;background:#F5F4F1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5F4F1;padding:28px 16px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#FFFFFF;border:1px solid #E9E5E0;border-radius:16px;overflow:hidden">
        <tr><td style="padding:24px 26px 8px">
          <div style="font-size:17px;color:#23201E"><b>sey.la</b> <span style="color:#9A938D">|</span> book</div>
        </td></tr>
        <tr><td style="padding:8px 26px 4px">
          <h1 style="margin:0;font-size:22px;color:#23201E">See you soon</h1>
          <p style="margin:8px 0 0;color:#47423F;font-size:15px;line-height:1.5">${lead}</p>
        </td></tr>
        <tr><td style="padding:16px 26px 4px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #E9E5E0">
            ${row("Studio", studioName)}
            ${row("Service", serviceName)}
            ${row("When", whenText)}
          </table>
        </td></tr>
        <tr><td style="padding:18px 26px 26px">
          <p style="margin:0;color:#6E6863;font-size:13px;line-height:1.5">Need to change it? Manage your bookings in your account. Free to cancel up to 12h before.</p>
        </td></tr>
      </table>
      <p style="max-width:480px;margin:16px auto 0;color:#9A938D;font-size:12px;text-align:center">sey.la | book · beauty &amp; wellness across the Seychelles</p>
    </td></tr>
  </table></body></html>`;
  return { subject, html };
}

// Branded class booking confirmation.
export function classConfirmationEmail({ studioName, className, whenText, priceText }) {
  const subject = `You're in · ${className || "class"}${studioName ? " · " + studioName : ""}`;
  const row = (l, v) => v ? `<tr><td style="padding:6px 0;color:#6E6863;font-size:14px">${l}</td><td style="padding:6px 0;color:#23201E;font-size:14px;font-weight:600;text-align:right">${v}</td></tr>` : "";
  const html = `<!doctype html><html><body style="margin:0;background:#F5F4F1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5F4F1;padding:28px 16px"><tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#FFFFFF;border:1px solid #E9E5E0;border-radius:16px;overflow:hidden">
      <tr><td style="padding:24px 26px 8px"><div style="font-size:17px;color:#23201E"><b>sey.la</b> <span style="color:#9A938D">|</span> book</div></td></tr>
      <tr><td style="padding:8px 26px 4px"><h1 style="margin:0;font-size:22px;color:#23201E">You're in 🌴</h1><p style="margin:8px 0 0;color:#47423F;font-size:15px;line-height:1.5">Your spot is booked. See you there.</p></td></tr>
      <tr><td style="padding:16px 26px 4px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #E9E5E0">
        ${row("Studio", studioName)}${row("Class", className)}${row("When", whenText)}${row("Price", priceText)}
      </table></td></tr>
      <tr><td style="padding:18px 26px 26px"><p style="margin:0;color:#6E6863;font-size:13px;line-height:1.5">Can't make it? Reply to let the studio know.</p></td></tr>
    </table>
    <p style="max-width:480px;margin:16px auto 0;color:#9A938D;font-size:12px;text-align:center">sey.la | book · beauty &amp; wellness across the Seychelles</p>
  </td></tr></table></body></html>`;
  return { subject, html };
}

// Branded post-visit review request. `reviewUrl` carries a signed token.
export function reviewRequestEmail({ studioName, serviceName, reviewUrl }) {
  const subject = `How was your visit${studioName ? " to " + studioName : ""}?`;
  const html = `<!doctype html><html><body style="margin:0;background:#F5F4F1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5F4F1;padding:28px 16px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#FFFFFF;border:1px solid #E9E5E0;border-radius:16px;overflow:hidden">
        <tr><td style="padding:24px 26px 8px">
          <div style="font-size:17px;color:#23201E"><b>sey.la</b> <span style="color:#9A938D">|</span> book</div>
        </td></tr>
        <tr><td style="padding:8px 26px 4px">
          <h1 style="margin:0;font-size:22px;color:#23201E">How was it?</h1>
          <p style="margin:8px 0 0;color:#47423F;font-size:15px;line-height:1.5">Hope you enjoyed ${serviceName ? "your " + serviceName : "your visit"}${studioName ? " at " + studioName : ""}. A quick rating helps other islanders find great studios.</p>
        </td></tr>
        <tr><td style="padding:20px 26px 6px">
          <a href="${reviewUrl}" style="display:inline-block;background:#23201E;color:#FFFFFF;text-decoration:none;font-size:15px;font-weight:600;padding:13px 22px;border-radius:999px">Leave a review</a>
        </td></tr>
        <tr><td style="padding:14px 26px 26px">
          <p style="margin:0;color:#9A938D;font-size:12px;line-height:1.5">Takes ten seconds. If you'd rather not, just ignore this — no worries.</p>
        </td></tr>
      </table>
      <p style="max-width:480px;margin:16px auto 0;color:#9A938D;font-size:12px;text-align:center">sey.la | book · beauty &amp; wellness across the Seychelles</p>
    </td></tr>
  </table></body></html>`;
  return { subject, html };
}

// Branded booking confirmation (off-white / graphite, matches the app).
export function bookingConfirmationEmail({ studioName, serviceName, whenText, priceText }) {
  const subject = `Booking confirmed${studioName ? " · " + studioName : ""}`;
  const row = (label, value) =>
    value
      ? `<tr><td style="padding:6px 0;color:#6E6863;font-size:14px">${label}</td><td style="padding:6px 0;color:#23201E;font-size:14px;font-weight:600;text-align:right">${value}</td></tr>`
      : "";
  const html = `<!doctype html><html><body style="margin:0;background:#F5F4F1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5F4F1;padding:28px 16px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#FFFFFF;border:1px solid #E9E5E0;border-radius:16px;overflow:hidden">
        <tr><td style="padding:24px 26px 8px">
          <div style="font-size:17px;color:#23201E"><b>sey.la</b> <span style="color:#9A938D">|</span> book</div>
        </td></tr>
        <tr><td style="padding:8px 26px 4px">
          <h1 style="margin:0;font-size:22px;color:#23201E">You're booked in 🌴</h1>
          <p style="margin:8px 0 0;color:#47423F;font-size:15px;line-height:1.5">Your appointment is confirmed. See you soon.</p>
        </td></tr>
        <tr><td style="padding:16px 26px 4px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #E9E5E0">
            ${row("Studio", studioName)}
            ${row("Service", serviceName)}
            ${row("When", whenText)}
            ${row("Price", priceText)}
          </table>
        </td></tr>
        <tr><td style="padding:18px 26px 26px">
          <p style="margin:0;color:#6E6863;font-size:13px;line-height:1.5">Need to change it? Manage your bookings in your account. Free to cancel up to 12h before.</p>
        </td></tr>
      </table>
      <p style="max-width:480px;margin:16px auto 0;color:#9A938D;font-size:12px;text-align:center">sey.la | book · beauty &amp; wellness across the Seychelles</p>
    </td></tr>
  </table></body></html>`;
  return { subject, html };
}
