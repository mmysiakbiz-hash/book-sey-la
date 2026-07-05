// Billing model (Stripe is a placeholder for now — this is the state machine).
//
// - 3 months free from registration (studios.trial_ends_at).
// - Then 400 SCR per linked staff member per cycle.
// - 14 days to pay after a cycle comes due.
// - If still unpaid after the grace window → account blocked (hidden from public).
//
// paid_until (set by a future real payment) extends the paid-through date.
export const SCR_PER_STAFF = 400;
export const GRACE_DAYS = 14;
const DAY = 86400000;

// studio: { trial_ends_at, paid_until, billing_blocked }; staffCount: number
export function billingStatus(studio, staffCount) {
  const now = Date.now();
  const trialEnds = studio && studio.trial_ends_at ? new Date(studio.trial_ends_at).getTime() : now;
  const paidUntil = studio && studio.paid_until ? new Date(studio.paid_until).getTime() : null;
  const dueAt = paidUntil != null ? paidUntil : trialEnds; // end of the current free/paid period
  const blockAt = dueAt + GRACE_DAYS * DAY;
  const amount = SCR_PER_STAFF * Math.max(0, staffCount || 0);
  const paid = paidUntil != null && paidUntil >= trialEnds;

  let state;
  if (studio && studio.billing_blocked) state = "blocked";
  else if (now < dueAt) state = paid ? "active" : "trial";
  else if (now < blockAt) state = "due";
  else state = "overdue"; // past grace, pending block by the cron

  return {
    state,
    amount,
    staffCount: Math.max(0, staffCount || 0),
    dueAt,
    blockAt,
    daysUntilDue: Math.ceil((dueAt - now) / DAY),
    daysUntilBlock: Math.ceil((blockAt - now) / DAY),
    graceDays: GRACE_DAYS,
    perStaff: SCR_PER_STAFF,
  };
}
