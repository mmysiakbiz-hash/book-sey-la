// Tiny CSV export helper (client-side download from already-loaded rows).
export function toCSV(rows, columns) {
  const esc = (v) => { const s = v == null ? "" : String(v); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
  const head = columns.map((c) => esc(c.label)).join(",");
  const body = (rows || []).map((r) => columns.map((c) => esc(typeof c.get === "function" ? c.get(r) : r[c.key])).join(",")).join("\n");
  return head + "\n" + body;
}

export function downloadCSV(filename, rows, columns) {
  if (typeof window === "undefined") return;
  const csv = toCSV(rows, columns);
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
