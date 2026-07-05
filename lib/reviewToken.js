// Signed review-link tokens — lets a guest submit a review from an email link
// without a login. Token = HMAC-SHA256(bookingId) with REVIEW_SECRET (falls back
// to CRON_SECRET). Server-only (uses node:crypto).
import crypto from "crypto";

function secret() {
  return process.env.REVIEW_SECRET || process.env.CRON_SECRET || "";
}

export function reviewSecretConfigured() {
  return Boolean(secret());
}

export function signReviewToken(bookingId) {
  const s = secret();
  if (!s || !bookingId) return "";
  return crypto.createHmac("sha256", s).update(String(bookingId)).digest("hex");
}

export function verifyReviewToken(bookingId, token) {
  const expected = signReviewToken(bookingId);
  if (!expected || !token) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(String(token));
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
