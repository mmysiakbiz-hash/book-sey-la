// sey.la | book PWA — shared UI helpers + local icons. Exposes on window.
(function () {
  const { Icon } = window.SeyLaBookDesignSystem_611419;
  const e = React.createElement;

  // Local icons not in the design-system set (stroke 1.75, 24-box) — home, user, bell, filter, back, share, bookmark.
  const LOCAL = {
    home: "M4 11.5 12 4l8 7.5M6 10v9a1 1 0 0 0 1 1h3v-6h4v6h3a1 1 0 0 0 1-1v-9",
    user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM5 20c.8-3.5 3.6-5.5 7-5.5s6.2 2 7 5.5",
    bell: "M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6M10 20a2 2 0 0 0 4 0",
    filter: "M4 6h16M7 12h10M10 18h4",
    back: "M15 5l-7 7 7 7",
    share: "M12 15V4m0 0-3.5 3.5M12 4l3.5 3.5M5 12v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6",
    bookmark: "M6 4h12v16l-6-4-6 4V4Z",
    globe: "M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM4 12h16M12 4c2.5 2.2 2.5 13.8 0 16M12 4c-2.5 2.2-2.5 13.8 0 16",
    card: "M3 8h18M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8Zm3 6h4",
    help: "M9.2 9a2.8 2.8 0 1 1 3.6 2.7c-.8.3-1.3 1-1.3 1.8v.5M12 17h.01M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z",
    logout: "M14 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2M9 12h11m0 0-3-3m3 3-3 3",
  };

  function Ic({ name, size = 22, color = "currentColor", fill = "none", sw = 1.75, style }) {
    if (LOCAL[name]) {
      return e("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none",
        stroke: color, strokeWidth: sw, strokeLinecap: "round", strokeLinejoin: "round", style, "aria-hidden": true },
        e("path", { d: LOCAL[name] }));
    }
    return e(Icon, { name, size, color, fill, strokeWidth: sw, style });
  }

  function Stars({ r = 5, size = 13 }) {
    return e("span", { className: "rating", "aria-label": r + " stars" },
      e(Ic, { name: "star", size, color: "var(--ink)", fill: "var(--ink)" }));
  }

  // Fade-up wrapper honoring reduced motion is handled by CSS class .fu
  window.SEY_UI = { Ic, Stars, e };
})();
