// Client-facing service prices are shown in Seychellois Rupees (SCR). There's no
// in-app payment at launch — clients pay the studio on site (cash or card) — so
// prices reflect the local currency. (The studio's own subscription to sey.la is
// billed separately in EUR; that's unrelated to these service prices.)
export function scr(n) {
  const v = Math.round(Number(n) || 0);
  return `SCR ${v}`;
}
