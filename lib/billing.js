// Billing model (Stripe is a placeholder for now — this is the state machine).
//
// - 3 months free from registration (studios.trial_ends_at).
// - Then €25 per team member per cycle — the base covers the studio + its first
//   team member, and each additional team member is another €25, i.e.
//   25 × max(1, staff).
// - PLUS a 20% commission on each *acquired* client's first booking
//   (bookings.commission_due; see /api/book). Regulars a studio imports itself
//   are not acquired, so they carry no commission.
// - 14 days to pay after a cycle comes due.
// - If still unpaid after the grace window → account blocked (hidden from public).
//
// paid_until (set by a future real payment) extends the paid-through date.
export const EUR_PER_USER = 25;
export const COMMISSION_RATE = 0.20;
export const GRACE_DAYS = 14;
const DAY = 86400000;

// studio: { trial_ends_at, paid_until, billing_blocked }; staffCount: number
export function billingStatus(studio, staffCount) {
  const now = Date.now();
  const trialEnds = studio && studio.trial_ends_at ? new Date(studio.trial_ends_at).getTime() : now;
  const paidUntil = studio && studio.paid_until ? new Date(studio.paid_until).getTime() : null;
  const dueAt = paidUntil != null ? paidUntil : trialEnds; // end of the current free/paid period
  const blockAt = dueAt + GRACE_DAYS * DAY;
  const users = Math.max(1, staffCount || 0); // base covers the first team member
  const amount = EUR_PER_USER * users;
  const paid = paidUntil != null && paidUntil >= trialEnds;

  let state;
  if (studio && studio.billing_blocked) state = "blocked";
  else if (now < dueAt) state = paid ? "active" : "trial";
  else if (now < blockAt) state = "due";
  else state = "overdue"; // past grace, pending block by the cron

  return {
    state,
    amount,
    users,
    staffCount: Math.max(0, staffCount || 0),
    dueAt,
    blockAt,
    daysUntilDue: Math.ceil((dueAt - now) / DAY),
    daysUntilBlock: Math.ceil((blockAt - now) / DAY),
    graceDays: GRACE_DAYS,
    perUser: EUR_PER_USER,
    commissionRate: COMMISSION_RATE,
  };
}
