// WhatsApp transactional messages — SERVER ONLY. Never import into client code.
//
// Provider-agnostic thin wrapper, defaulting to Whapi.cloud (a gateway that hosts
// the WhatsApp session for us, so a serverless app just makes one HTTP call — the
// same shape as lib/email.js). Feature-flagged: with no WHAPI_TOKEN set every call
// is a no-op ({ skipped: true }), so email keeps working and WhatsApp is purely
// additive. Swapping to the official Meta Cloud API later = change this file only.
//
// Env (server-only): WHAPI_TOKEN (required to enable), WHAPI_BASE (optional,
// default https://gate.whapi.cloud), WHATSAPP_DEFAULT_CC (optional, default 248).
const DEFAULT_BASE = "https://gate.whapi.cloud";

export function hasWhatsApp() {
  return Boolean(process.env.WHAPI_TOKEN);
}

// Best-effort E.164-ish normalisation: strip formatting, drop a 00 intl prefix,
// and prepend the default country code for bare local (Seychelles) numbers.
export function normalizePhone(raw) {
  let d = String(raw || "").replace(/[^\d]/g, "");
  if (!d) return "";
  if (d.startsWith("00")) d = d.slice(2);
  const cc = (process.env.WHATSAPP_DEFAULT_CC || "248").replace(/\D/g, "");
  if (d.length <= 7) d = cc + d; // local number → add country code
  return d;
}

export async function sendWhatsApp({ to, body }) {
  const token = process.env.WHAPI_TOKEN;
  if (!token) return { skipped: true }; // feature off — not an error
  const phone = normalizePhone(to);
  if (!phone) return { error: "missing_recipient" };
  if (!body) return { error: "missing_body" };
  const base = (process.env.WHAPI_BASE || DEFAULT_BASE).replace(/\/+$/, "");
  try {
    const res = await fetch(`${base}/messages/text`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({ to: phone, body }),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      const err = `whapi_${res.status}: ${t.slice(0, 300)}`;
      console.error("[whatsapp] send failed:", err);
      return { error: err };
    }
    const data = await res.json().catch(() => ({}));
    return { ok: true, id: (data && (data.id || (data.message && data.message.id))) || null };
  } catch (e) {
    console.error("[whatsapp] fetch failed:", e && e.message);
    return { error: "whapi_fetch_failed" };
  }
}

// --- Plain-text message bodies (WhatsApp isn't HTML) ---

export function bookingConfirmationText({ studioName, serviceName, whenText, priceText }) {
  return [
    `✅ Booking confirmed${studioName ? " · " + studioName : ""}`,
    serviceName ? `Service: ${serviceName}` : "",
    whenText ? `When: ${whenText}` : "",
    priceText ? `Price: ${priceText}` : "",
    "",
    "See you soon — sey.la | book",
  ].filter(Boolean).join("\n");
}

export function bookingReminderText({ studioName, serviceName, whenText, kind }) {
  const lead = kind === "2h" ? "Your appointment is in about 2 hours." : "Reminder: your appointment is tomorrow.";
  return [
    `⏰ ${lead}`,
    studioName ? `Studio: ${studioName}` : "",
    serviceName ? `Service: ${serviceName}` : "",
    whenText ? `When: ${whenText}` : "",
    "",
    "See you soon — sey.la | book",
  ].filter(Boolean).join("\n");
}
