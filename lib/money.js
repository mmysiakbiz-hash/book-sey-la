// Client-facing service prices are shown in Seychellois Rupees (SCR). There's no
// in-app payment at launch — clients pay the studio on site (cash or card) — so
// prices reflect the local currency. (The studio's own subscription to sey.la is
// billed separately in EUR; that's unrelated to these service prices.)
export function scr(n) {
  // A price that isn't set (null / "" / non-numeric) shows as "On request" rather
  // than a misleading "SCR 0" — some studios don't publish every price up front.
  if (n == null || n === "" || isNaN(Number(n))) return "On request";
  return `SCR ${Math.round(Number(n))}`;
}
