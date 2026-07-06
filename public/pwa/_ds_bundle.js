/* @ds-bundle: {"format":4,"namespace":"SeyLaBookDesignSystem_611419","components":[{"name":"BookingCard","sourcePath":"components/booking/BookingCard.jsx"},{"name":"CategoryTile","sourcePath":"components/booking/CategoryTile.jsx"},{"name":"ClassCard","sourcePath":"components/booking/ClassCard.jsx"},{"name":"SearchBar","sourcePath":"components/booking/SearchBar.jsx"},{"name":"StepCard","sourcePath":"components/booking/StepCard.jsx"},{"name":"StudioCard","sourcePath":"components/booking/StudioCard.jsx"},{"name":"TrustPoint","sourcePath":"components/booking/TrustPoint.jsx"},{"name":"ArchMirror","sourcePath":"components/brand/ArchMirror.jsx"},{"name":"FamilySwitcher","sourcePath":"components/brand/FamilySwitcher.jsx"},{"name":"Icon","sourcePath":"components/brand/Icon.jsx"},{"name":"ICON_NAMES","sourcePath":"components/brand/Icon.jsx"},{"name":"Logo","sourcePath":"components/brand/Logo.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"SectionHeader","sourcePath":"components/core/SectionHeader.jsx"}],"sourceHashes":{"components/booking/BookingCard.jsx":"14a0fc32f8a3","components/booking/CategoryTile.jsx":"09b9c2e7f796","components/booking/ClassCard.jsx":"37e2e170b965","components/booking/SearchBar.jsx":"d6b6fe0bffec","components/booking/StepCard.jsx":"e17c20978528","components/booking/StudioCard.jsx":"c07ca90510c0","components/booking/TrustPoint.jsx":"92fa670b15e8","components/brand/ArchMirror.jsx":"d80f32f6fc7f","components/brand/FamilySwitcher.jsx":"c8dcc137a92b","components/brand/Icon.jsx":"64f60a17d78a","components/brand/Logo.jsx":"1f32d1ab7850","components/core/Badge.jsx":"e4e1c1d66500","components/core/Button.jsx":"d9ea2f536ffc","components/core/Input.jsx":"5d1ddfc0cb36","components/core/SectionHeader.jsx":"fb3a8c8a3d52","ui_kits/admin/AdminPanel.jsx":"e3d315c36009","ui_kits/customer/CustomerAccount.jsx":"c72d61be1572","ui_kits/landing/Categories.jsx":"14d0870e68a6","ui_kits/landing/FeaturedStudios.jsx":"903b9a20cd90","ui_kits/landing/FinalCTA.jsx":"393407b265fc","ui_kits/landing/Hero.jsx":"13863fc24f95","ui_kits/landing/HowItWorks.jsx":"66dbb43d2dca","ui_kits/landing/Nav.jsx":"7b04967cb47c","ui_kits/landing/PhotoStrip.jsx":"11924bef0c3e","ui_kits/landing/Trust.jsx":"5f8f31de74ec","ui_kits/mobile/App.jsx":"22f113871642","ui_kits/mobile/data.js":"0c6e4ac412f0","ui_kits/mobile/service-worker.js":"3e1fc00ac181","ui_kits/mobile/ui.js":"5bebe2dcf28c","ui_kits/provider/ProviderPanel.jsx":"800684d01a49","ui_kits/salon/SalonPanel.jsx":"7e593a2516c4","ui_kits/search/SearchPage.jsx":"8976fad9ccbe","ui_kits/studios/StudiosClose.jsx":"446acd5086fa","ui_kits/studios/StudiosHero.jsx":"e359b4c5de74","ui_kits/studios/StudiosNav.jsx":"d1262c0753b6","ui_kits/studios/StudiosOnboarding.jsx":"caa47d791f85","ui_kits/studios/StudiosProof.jsx":"bf8ab45ddac4","ui_kits/studios/StudiosValue.jsx":"2c3c4560709d","ui_kits/venue/VenueClose.jsx":"f1d590b35377","ui_kits/venue/VenueHero.jsx":"03be59f5948e","ui_kits/venue/VenueServices.jsx":"031173248ba9","ui_kits/venue/VenueShowcase.jsx":"0ddbae8c7968"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.SeyLaBookDesignSystem_611419 = window.SeyLaBookDesignSystem_611419 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/booking/StepCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * StepCard — a numbered step for "How it works". Designed for the dark cocoa band
 * (onDark default true) with cream text.
 */
function StepCard({
  step,
  title,
  children,
  icon,
  onDark = true,
  style = {},
  ...rest
}) {
  const ink = onDark ? "var(--cream)" : "var(--cocoa)";
  const muted = onDark ? "var(--cream-70)" : "var(--cocoa-60)";
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "14px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 44,
      height: 44,
      flex: "none",
      borderRadius: "var(--radius-pill)",
      border: `1.5px solid ${onDark ? "var(--cocoa-line)" : "var(--line-strong)"}`,
      display: "grid",
      placeItems: "center",
      fontFamily: "var(--font-display)",
      fontStyle: "italic",
      fontSize: "1.25rem",
      color: "var(--brass)"
    }
  }, step), icon && /*#__PURE__*/React.createElement("span", {
    style: {
      color: onDark ? "var(--cream-70)" : "var(--clay)"
    }
  }, icon)), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      color: ink,
      fontSize: "var(--text-h3)",
      fontWeight: 600
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: muted,
      fontSize: "var(--text-body)",
      lineHeight: "var(--lh-normal)"
    }
  }, children));
}
Object.assign(__ds_scope, { StepCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/booking/StepCard.jsx", error: String((e && e.message) || e) }); }

// components/booking/TrustPoint.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * TrustPoint — a single reassurance point with a line icon and short copy.
 * Used in the 4-up trust row.
 */
function TrustPoint({
  icon,
  title,
  children,
  onDark = false,
  style = {},
  ...rest
}) {
  const ink = onDark ? "var(--cream)" : "var(--cocoa)";
  const muted = onDark ? "var(--cream-70)" : "var(--cocoa-60)";
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 46,
      height: 46,
      borderRadius: "14px",
      background: onDark ? "rgba(245,234,224,0.1)" : "var(--confirmed-soft)",
      display: "grid",
      placeItems: "center",
      color: onDark ? "var(--cream)" : "var(--eucalyptus)"
    }
  }, icon), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      color: ink,
      fontSize: "1.1rem",
      fontWeight: 600
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: muted,
      fontSize: "var(--text-sm)",
      lineHeight: "var(--lh-normal)"
    }
  }, children));
}
Object.assign(__ds_scope, { TrustPoint });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/booking/TrustPoint.jsx", error: String((e && e.message) || e) }); }

// components/brand/FamilySwitcher.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const FAMILY = ["tour", "book", "bazar", "moto", "villa", "lokal"];

/**
 * FamilySwitcher — pill switcher across the sey.la family of products.
 * Current product is highlighted in clay.
 */
function FamilySwitcher({
  active = "book",
  products = FAMILY,
  onSelect,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("nav", _extends({
    "aria-label": "sey.la family",
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "2px",
      padding: "4px",
      borderRadius: "var(--radius-pill)",
      background: "rgba(59,42,37,0.05)",
      border: "1px solid var(--line)",
      ...style
    }
  }, rest), products.map(p => {
    const on = p === active;
    return /*#__PURE__*/React.createElement("button", {
      key: p,
      type: "button",
      "aria-current": on ? "page" : undefined,
      onClick: onSelect ? () => onSelect(p) : undefined,
      style: {
        appearance: "none",
        border: "none",
        cursor: "pointer",
        font: "inherit",
        fontFamily: "var(--font-body)",
        fontSize: "var(--text-sm)",
        fontWeight: on ? 600 : 500,
        letterSpacing: "0.01em",
        padding: "6px 14px",
        borderRadius: "var(--radius-pill)",
        color: on ? "var(--surface)" : "var(--cocoa-60)",
        background: on ? "var(--clay)" : "transparent",
        transition: "background var(--dur-fast) var(--ease-soft), color var(--dur-fast) var(--ease-soft)"
      }
    }, p);
  }));
}
Object.assign(__ds_scope, { FamilySwitcher });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/FamilySwitcher.jsx", error: String((e && e.message) || e) }); }

// components/brand/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Icon — the sey.la | book line-icon set.
 * 24×24, ~1.6 stroke, round caps/joins, no fill. No emoji, ever.
 */

const PATHS = {
  // Category icons
  hair: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "7",
    r: "2.4"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "17",
    r: "2.4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 8.2 20 16M9 15.8 20 8"
  })),
  nails: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M9 21h6M9 21c-.5-3 0-6 .4-8.5C9.9 8 10.6 4 12 4s2.1 4 2.6 8.5c.3 2.5.9 5.5.4 8.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9.6 12.5h4.8"
  })),
  spa: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M12 20c0-4 0-7-2.5-9.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 20c0-4 0-7 2.5-9.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 20c-3.5 0-6-1-7.5-3 2.5-1 5 0 7.5 3Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 20c3.5 0 6-1 7.5-3-2.5-1-5 0-7.5 3Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 11c-.8-2 0-4 0-4s.8 2 0 4Z"
  })),
  barber: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "6",
    cy: "6",
    r: "2.2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "6",
    cy: "18",
    r: "2.2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7.8 7.6 18 16.4M7.8 16.4 18 7.6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M18 7.6v-2M18 16.4v2"
  })),
  brows: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M3 12c3-4.5 15-4.5 18 0"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4.5 15c2.5 3 12.5 3 15 0"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "14.5",
    r: "1.4"
  })),
  makeup: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M14.5 4.5 19.5 9.5 9 20 4 20 4 15Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12.5 6.5 17.5 11.5"
  })),
  fitness: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M4 9v6M20 9v6M4 12h16"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "2.5",
    y: "8",
    width: "2.2",
    height: "8",
    rx: "1"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "19.3",
    y: "8",
    width: "2.2",
    height: "8",
    rx: "1"
  })),
  auto: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M4 16v-3l2-5h12l2 5v3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 16h18"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7.5",
    cy: "16.5",
    r: "1.6"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "16.5",
    cy: "16.5",
    r: "1.6"
  })),
  skin: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12.4",
    r: "7.3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "9.4",
    cy: "11",
    r: "0.5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "14.6",
    cy: "11",
    r: "0.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9.2 14.4c.8.9 1.7 1.3 2.8 1.3s2-.4 2.8-1.3"
  })),
  waxing: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
    x: "4.3",
    y: "8.6",
    width: "12",
    height: "7",
    rx: "2.2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7.5 12h5.6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16.8 10.4c1.6-.6 2.7.4 2.7 1.6s-1.1 2.2-2.7 1.6"
  })),
  tattoo: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
    x: "11.4",
    y: "3.9",
    width: "6.6",
    height: "4.6",
    rx: "1.6",
    transform: "rotate(45 14.7 6.2)"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12.4 8.3 6 14.7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M6 14.7 4.4 19.6 9.4 18"
  })),
  piercing: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "10",
    cy: "14",
    r: "5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "14.8",
    cy: "9.4",
    r: "1.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M13.4 10.7 11.7 12.4"
  })),
  trainer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M4 10.5h8.5a3 3 0 0 1 0 6H8.5a4.5 4.5 0 0 1-4.5-4.5Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12.5 10.5V7.5H16"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "8",
    cy: "13.3",
    r: "1.3"
  })),
  // UI icons
  search: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "6.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m20 20-4-4"
  })),
  pin: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M12 21c4-4.5 7-7.7 7-11a7 7 0 1 0-14 0c0 3.3 3 6.5 7 11Z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "10",
    r: "2.4"
  })),
  calendar: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
    x: "4",
    y: "5",
    width: "16",
    height: "16",
    rx: "2.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4 9.5h16M8 3.5v3M16 3.5v3"
  })),
  clock: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 7.5V12l3 2"
  })),
  check: /*#__PURE__*/React.createElement("path", {
    d: "m5 12.5 4.5 4.5L19 7"
  }),
  shield: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M12 3 19 6v5c0 4.5-3 7.8-7 10-4-2.2-7-5.5-7-10V6Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m9 12 2 2 4-4"
  })),
  heart: /*#__PURE__*/React.createElement("path", {
    d: "M12 20C7 16.5 4 13.5 4 9.8 4 7.1 6 5.2 8.4 5.2c1.6 0 2.8.8 3.6 2 .8-1.2 2-2 3.6-2C18 5.2 20 7.1 20 9.8c0 3.7-3 6.7-8 10.2Z"
  }),
  chevronDown: /*#__PURE__*/React.createElement("path", {
    d: "m6 9.5 6 6 6-6"
  }),
  chevronRight: /*#__PURE__*/React.createElement("path", {
    d: "m9.5 6 6 6-6 6"
  }),
  arrowRight: /*#__PURE__*/React.createElement("path", {
    d: "M4 12h15m0 0-6-6m6 6-6 6"
  }),
  menu: /*#__PURE__*/React.createElement("path", {
    d: "M4 7h16M4 12h16M4 17h16"
  }),
  close: /*#__PURE__*/React.createElement("path", {
    d: "M6 6 18 18M18 6 6 18"
  }),
  star: /*#__PURE__*/React.createElement("path", {
    d: "M12 4.5l2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4L7.4 18.3l.9-5L4.7 9.8l5-.7Z"
  }),
  sparkle: /*#__PURE__*/React.createElement("path", {
    d: "M12 4c.6 3.4 1.6 4.4 5 5-3.4.6-4.4 1.6-5 5-.6-3.4-1.6-4.4-5-5 3.4-.6 4.4-1.6 5-5Z"
  }),
  lotus: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M12 19c-3.6 0-6.5-1.4-8-4 2-1.2 4.4-.7 6.2 1"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 19c3.6 0 6.5-1.4 8-4-2-1.2-4.4-.7-6.2 1"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 19c-1.8-1.5-3-3.5-3-5.7 0-2.6 1.4-4.8 3-6.3 1.6 1.5 3 3.7 3 6.3 0 2.2-1.2 4.2-3 5.7Z"
  }))
};
function Icon({
  name,
  size = 24,
  stroke = 1.6,
  color = "currentColor",
  label,
  style = {},
  ...rest
}) {
  const path = PATHS[name];
  if (!path) return null;
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    role: label ? "img" : "presentation",
    "aria-label": label || undefined,
    "aria-hidden": label ? undefined : true,
    style: {
      display: "block",
      flex: "none",
      ...style
    }
  }, rest), path);
}
const ICON_NAMES = Object.keys(PATHS);
Object.assign(__ds_scope, { Icon, ICON_NAMES });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Icon.jsx", error: String((e && e.message) || e) }); }

// components/booking/CategoryTile.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * CategoryTile — a service category card with a line icon.
 * Lifts gently on hover. Used in the 8-category grid.
 */
function CategoryTile({
  icon,
  label,
  count,
  as = "a",
  style = {},
  ...rest
}) {
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: "sey-cat-tile",
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "18px",
      padding: "22px",
      minHeight: "140px",
      justifyContent: "space-between",
      background: "var(--surface)",
      border: "1px solid var(--line)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "var(--shadow-sm)",
      color: "var(--cocoa)",
      textDecoration: "none",
      cursor: "pointer",
      transition: "transform var(--dur-med) var(--ease-soft), box-shadow var(--dur-med) var(--ease-soft), border-color var(--dur-med) var(--ease-soft)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 48,
      height: 48,
      borderRadius: "16px",
      background: "var(--blush)",
      display: "grid",
      placeItems: "center",
      color: "var(--clay)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 26
  })), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: "1.2rem",
      lineHeight: 1.15
    }
  }, label), count != null && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontSize: "var(--text-xs)",
      color: "var(--cocoa-60)",
      marginTop: 5
    }
  }, count, " studios")), /*#__PURE__*/React.createElement("style", null, `
        .sey-cat-tile:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); border-color: var(--line-strong); }
        .sey-cat-tile:active { transform: translateY(-1px); }
      `));
}
Object.assign(__ds_scope, { CategoryTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/booking/CategoryTile.jsx", error: String((e && e.message) || e) }); }

// components/booking/ClassCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * ClassCard — a group-class slot for schedules (yoga, movement, personal training).
 * Shows day/time, instructor, and live spots-left with a capacity bar; the Join
 * button shifts to "Almost full" near capacity and "Join waitlist" when full.
 */
function ClassCard({
  day = "Mon",
  time = "07:00",
  name = "Sunrise beach yoga",
  instructor = "with Aline",
  duration = "60 min",
  level = "All levels",
  price = "€18",
  spotsLeft = 4,
  capacity = 12,
  onJoin,
  style = {},
  ...rest
}) {
  const full = spotsLeft <= 0;
  const almost = !full && spotsLeft <= 2;
  const taken = Math.max(0, capacity - spotsLeft);
  const pct = capacity > 0 ? Math.min(100, Math.round(taken / capacity * 100)) : 0;
  const barColor = full ? "var(--clay)" : almost ? "var(--brass)" : "var(--eucalyptus)";
  const spotLabel = full ? "Full" : spotsLeft + " of " + capacity + " spots left";
  return /*#__PURE__*/React.createElement("article", _extends({
    style: {
      display: "flex",
      alignItems: "stretch",
      gap: 0,
      background: "var(--surface)",
      border: "1px solid var(--line)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "var(--shadow-sm)",
      overflow: "hidden",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "none",
      width: 84,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 2,
      background: "var(--blush)",
      color: "var(--cocoa)",
      padding: "14px 8px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xs)",
      fontWeight: 600,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "var(--cocoa-60)"
    }
  }, day), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1
    }
  }, time)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      padding: "16px 18px",
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: "1.15rem",
      fontWeight: 600,
      color: "var(--cocoa)",
      lineHeight: 1.2
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 12,
      marginTop: 4,
      fontSize: "var(--text-sm)",
      color: "var(--cocoa-60)"
    }
  }, /*#__PURE__*/React.createElement("span", null, instructor), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "clock",
    size: 13,
    color: "var(--cocoa-40)"
  }), " ", duration), /*#__PURE__*/React.createElement("span", null, level))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      fontSize: "var(--text-sm)",
      fontWeight: 600,
      color: full ? "var(--clay)" : almost ? "var(--brass-ink, var(--brass))" : "var(--eucalyptus)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: full ? "close" : "check",
    size: 14,
    color: barColor
  }), " ", spotLabel), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "1.15rem",
      fontWeight: 600,
      color: "var(--cocoa)"
    }
  }, price)), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 5,
      borderRadius: 999,
      background: "var(--line)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: pct + "%",
      height: "100%",
      background: barColor,
      borderRadius: 999,
      transition: "width var(--dur-med) var(--ease-soft)"
    }
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "none",
      display: "flex",
      alignItems: "center",
      padding: "0 18px 0 6px"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onJoin,
    className: "sey-classjoin" + (full ? " is-full" : ""),
    style: {
      fontFamily: "var(--font-body)",
      fontWeight: 600,
      fontSize: "var(--text-sm)",
      whiteSpace: "nowrap",
      cursor: "pointer",
      borderRadius: "var(--radius-pill)",
      padding: "10px 18px",
      transition: "background var(--dur-fast) var(--ease-soft), border-color var(--dur-fast) var(--ease-soft)",
      color: full ? "var(--cocoa)" : "var(--surface)",
      background: full ? "transparent" : "var(--clay)",
      border: full ? "1.5px solid var(--border-strong)" : "1px solid transparent"
    }
  }, full ? "Join waitlist" : almost ? "Almost full · Join" : "Join class", /*#__PURE__*/React.createElement("style", null, `
            .sey-classjoin:not(.is-full):hover { background: var(--clay-hover); }
            .sey-classjoin.is-full:hover { border-color: var(--clay); color: var(--clay); }
            .sey-classjoin:active { transform: translateY(1px); }
          `))));
}
Object.assign(__ds_scope, { ClassCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/booking/ClassCard.jsx", error: String((e && e.message) || e) }); }

// components/booking/StudioCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * StudioCard — a marketplace venue card (Fresha/Booksy style) with a warm-treated
 * photo, rating + review count, area, and bookable service rows with prices.
 */
function StudioCard({
  name = "Kreol Spa",
  location = "Beau Vallon, Mahé",
  category = "Spa & massage",
  image,
  rating = 4.9,
  reviews = 128,
  priceFrom = "€45",
  services = [],
  badge,
  available = "Today",
  as = "a",
  style = {},
  ...rest
}) {
  const src = image ? image.includes("?") ? image : image + "?auto=format&fit=crop&w=800&q=70" : null;
  const rows = services && services.length ? services.slice(0, 2) : null;
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: "sey-studio-card",
    style: {
      display: "flex",
      flexDirection: "column",
      background: "var(--surface)",
      border: "1px solid var(--line)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "var(--shadow-sm)",
      overflow: "hidden",
      color: "var(--cocoa)",
      textDecoration: "none",
      cursor: "pointer",
      transition: "transform var(--dur-med) var(--ease-soft), box-shadow var(--dur-med) var(--ease-soft)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      aspectRatio: "3 / 2",
      overflow: "hidden",
      background: "var(--blush)"
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name + " — " + category,
    loading: "lazy",
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      filter: "var(--photo-filter)",
      display: "block"
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      display: "grid",
      placeItems: "center",
      color: "var(--clay)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "spa",
    size: 34
  })), badge && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 12,
      left: 12,
      fontSize: "var(--text-xs)",
      fontWeight: 700,
      letterSpacing: "0.02em",
      color: "var(--surface)",
      background: "var(--clay)",
      borderRadius: "var(--radius-pill)",
      padding: "5px 11px"
    }
  }, badge), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Save " + name,
    onClick: e => e.preventDefault(),
    style: {
      position: "absolute",
      top: 10,
      right: 10,
      width: 38,
      height: 38,
      display: "grid",
      placeItems: "center",
      cursor: "pointer",
      borderRadius: "var(--radius-pill)",
      border: "none",
      background: "rgba(252,248,242,0.92)",
      color: "var(--clay)",
      backdropFilter: "blur(4px)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "heart",
    size: 18
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "15px 17px 17px",
      display: "flex",
      flexDirection: "column",
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: "1.18rem",
      fontWeight: 600,
      lineHeight: 1.15
    }
  }, name)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      marginTop: 7,
      fontSize: "var(--text-sm)",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      fontWeight: 700,
      color: "var(--cocoa)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "star",
    size: 15,
    color: "var(--brass)"
  }), " ", rating), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--cocoa-60)"
    }
  }, "(", reviews, ")"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--cocoa-40)"
    }
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--cocoa-60)"
    }
  }, location)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      display: "inline-flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xs)",
      fontWeight: 600,
      color: "var(--eucalyptus)",
      background: "var(--confirmed-soft)",
      borderRadius: "var(--radius-pill)",
      padding: "3px 9px"
    }
  }, category), available && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xs)",
      color: "var(--cocoa-60)"
    }
  }, "\xB7 Available ", available.toLowerCase())), rows ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      paddingTop: 12,
      borderTop: "1px solid var(--line)",
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, rows.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-sm)",
      fontWeight: 600,
      color: "var(--cocoa)",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, s.name), s.duration && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-xs)",
      color: "var(--cocoa-60)"
    }
  }, s.duration)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-sm)",
      fontWeight: 700
    }
  }, s.price), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xs)",
      fontWeight: 700,
      color: "var(--surface)",
      background: "var(--clay)",
      borderRadius: "var(--radius-pill)",
      padding: "6px 13px"
    }
  }, "Book"))))) : /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "auto",
      paddingTop: 14,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-sm)",
      color: "var(--cocoa-60)"
    }
  }, "from ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: "var(--cocoa)"
    }
  }, priceFrom)), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      fontSize: "var(--text-sm)",
      fontWeight: 600,
      color: "var(--clay)"
    }
  }, "Book ", /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "arrowRight",
    size: 16,
    color: "var(--clay)"
  })))), /*#__PURE__*/React.createElement("style", null, `
        .sey-studio-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
        .sey-studio-card:active { transform: translateY(-1px); }
      `));
}
Object.assign(__ds_scope, { StudioCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/booking/StudioCard.jsx", error: String((e && e.message) || e) }); }

// components/brand/ArchMirror.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * ArchMirror — the signature hero element. A tall salon-mirror arch filled with
 * a candlelight gradient, a line-drawn frangipani, a rising brass "scent wisp",
 * and a realistic booking card peeking from the bottom.
 * This is the one loud moment — use once, in the hero.
 */
function ArchMirror({
  service = "Coconut & Frangipani massage",
  studio = "Kreol Spa, Beau Vallon",
  when = "Tomorrow · 14:30",
  price = "€55",
  status = "Confirmed",
  image = "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=200&q=70",
  showCard = true,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: "relative",
      width: "min(100%, 380px)",
      margin: "0 auto",
      paddingBottom: showCard ? "56px" : 0,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      aspectRatio: "3 / 4.3",
      borderRadius: "190px 190px 26px 26px",
      background: "var(--grad-candle)",
      boxShadow: "var(--shadow-lg), inset 0 2px 14px rgba(255,240,214,0.5)",
      overflow: "hidden",
      isolation: "isolate"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "radial-gradient(60% 45% at 50% 78%, rgba(255,244,222,0.7), rgba(255,244,222,0) 70%)",
      mixBlendMode: "screen",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: "12px",
      borderRadius: "180px 180px 18px 18px",
      border: "1px solid rgba(178,146,95,0.55)",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 40 200",
    preserveAspectRatio: "none",
    "aria-hidden": "true",
    style: {
      position: "absolute",
      left: "50%",
      top: "8%",
      transform: "translateX(-50%)",
      width: "48px",
      height: "52%",
      overflow: "visible"
    }
  }, /*#__PURE__*/React.createElement("path", {
    className: "sey-wisp",
    d: "M20 200 C 6 168, 34 150, 20 118 C 8 92, 32 74, 20 44 C 12 24, 24 12, 20 0",
    fill: "none",
    stroke: "rgba(178,146,95,0.7)",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeDasharray: "7 10"
  })), /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 120 120",
    "aria-hidden": "true",
    style: {
      position: "absolute",
      left: "50%",
      bottom: "16%",
      transform: "translateX(-50%)",
      width: "58%",
      opacity: 0.92
    }
  }, /*#__PURE__*/React.createElement("g", {
    fill: "none",
    stroke: "rgba(59,42,37,0.55)",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, [0, 72, 144, 216, 288].map(deg => /*#__PURE__*/React.createElement("g", {
    key: deg,
    transform: `rotate(${deg} 60 60)`
  }, /*#__PURE__*/React.createElement("path", {
    d: "M60 60 C 44 52, 40 26, 55 10 C 62 4, 70 8, 70 20 C 70 38, 66 52, 60 60Z"
  }))), /*#__PURE__*/React.createElement("circle", {
    cx: "60",
    cy: "60",
    r: "6",
    stroke: "rgba(178,146,95,0.85)"
  })))), showCard && /*#__PURE__*/React.createElement("div", {
    className: "sey-arch-card",
    style: {
      position: "absolute",
      left: "50%",
      bottom: 0,
      transform: "translateX(-50%)",
      width: "min(96%, 340px)",
      background: "var(--surface)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "var(--shadow-float)",
      padding: "16px 18px",
      display: "flex",
      alignItems: "center",
      gap: "14px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 46,
      height: 46,
      flex: "none",
      borderRadius: "14px",
      background: "var(--blush)",
      overflow: "hidden",
      display: "grid",
      placeItems: "center",
      color: "var(--clay)"
    }
  }, image ? /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: "",
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      filter: "var(--photo-filter)"
    }
  }) : /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "spa",
    size: 24
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: "1rem",
      color: "var(--cocoa)",
      lineHeight: 1.2
    }
  }, service), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-xs)",
      color: "var(--cocoa-60)",
      marginTop: 3,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, studio), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginTop: 8,
      fontSize: "var(--text-xs)",
      color: "var(--cocoa-80)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "clock",
    size: 14,
    color: "var(--cocoa-60)"
  }), " ", when), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600
    }
  }, price))), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      alignSelf: "flex-start",
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      fontSize: "var(--text-xs)",
      fontWeight: 600,
      color: "var(--eucalyptus)",
      background: "var(--confirmed-soft)",
      borderRadius: "var(--radius-pill)",
      padding: "4px 9px"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 13,
    color: "var(--eucalyptus)"
  }), " ", status)), /*#__PURE__*/React.createElement("style", null, `
        @keyframes seyWispRise { to { stroke-dashoffset: -34; } }
        @keyframes seyArchFloat { 0%,100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(-8px); } }
        .sey-wisp { animation: seyWispRise 4.5s linear infinite; }
        .sey-arch-card { animation: seyArchFloat var(--dur-float, 6s) var(--ease-soft, ease-in-out) infinite; }
        @media (prefers-reduced-motion: reduce) {
          .sey-wisp, .sey-arch-card { animation: none; }
        }
      `));
}
Object.assign(__ds_scope, { ArchMirror });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/ArchMirror.jsx", error: String((e && e.message) || e) }); }

// components/brand/Logo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Logo — the sey.la | book wordmark, set in type (no logo file provided).
 * Family products can swap the "book" suffix.
 */
function Logo({
  product = "book",
  size = "md",
  color,
  mono = false,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: "1.05rem",
    md: "1.3rem",
    lg: "1.9rem"
  };
  const fs = sizes[size] || sizes.md;
  const base = color || "var(--cocoa)";
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      fontFamily: "var(--font-display)",
      fontSize: fs,
      fontWeight: 600,
      letterSpacing: "-0.01em",
      color: base,
      display: "inline-flex",
      alignItems: "baseline",
      gap: "0.4em",
      lineHeight: 1,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", null, "sey", /*#__PURE__*/React.createElement("span", {
    style: {
      color: mono ? base : "var(--clay)"
    }
  }, "."), "la"), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      fontFamily: "var(--font-body)",
      fontWeight: 400,
      fontSize: "0.62em",
      color: mono ? base : "var(--cocoa-40)",
      transform: "translateY(-0.05em)"
    }
  }, "|"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: "italic",
      fontWeight: 500,
      color: mono ? base : "var(--clay)"
    }
  }, product));
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Logo.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Badge — small status/label pill. Tones: neutral, brand, botanical, brass, confirmed.
 */
function Badge({
  children,
  tone = "neutral",
  iconLeft,
  style = {},
  ...rest
}) {
  const tones = {
    neutral: {
      bg: "rgba(59,42,37,0.06)",
      fg: "var(--cocoa-80)"
    },
    brand: {
      bg: "var(--blush)",
      fg: "var(--clay)"
    },
    botanical: {
      bg: "var(--confirmed-soft)",
      fg: "var(--eucalyptus)"
    },
    brass: {
      bg: "rgba(178,146,95,0.16)",
      fg: "#8a6f42"
    },
    confirmed: {
      bg: "var(--confirmed-soft)",
      fg: "var(--eucalyptus)"
    },
    dark: {
      bg: "rgba(245,234,224,0.14)",
      fg: "var(--cream)"
    }
  };
  const t = tones[tone] || tones.neutral;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "5px",
      fontFamily: "var(--font-body)",
      fontSize: "var(--text-xs)",
      fontWeight: 600,
      letterSpacing: "0.01em",
      lineHeight: 1,
      padding: "5px 11px",
      borderRadius: "var(--radius-pill)",
      background: t.bg,
      color: t.fg,
      ...style
    }
  }, rest), iconLeft, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/booking/BookingCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * BookingCard — a real booking summary. Standalone version of the card that
 * peeks from the hero arch; reusable in listings, confirmations, "my bookings".
 */
function BookingCard({
  service = "Coconut & Frangipani massage",
  studio = "Kreol Spa, Beau Vallon",
  when = "Tomorrow · 14:30",
  price = "€55",
  status = "Confirmed",
  icon = "spa",
  imageSlot = false,
  float = false,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("article", _extends({
    className: float ? "sey-booking-card sey-booking-card--float" : "sey-booking-card",
    style: {
      display: "flex",
      alignItems: "center",
      gap: "14px",
      width: "100%",
      maxWidth: "360px",
      background: "var(--surface)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "var(--shadow-md)",
      border: "1px solid var(--line)",
      padding: "16px 18px",
      ...style
    }
  }, rest), imageSlot ? /*#__PURE__*/React.createElement("div", {
    "aria-label": "Studio photo",
    style: {
      width: 52,
      height: 52,
      flex: "none",
      borderRadius: "14px",
      background: "var(--blush)",
      display: "grid",
      placeItems: "center",
      color: "var(--cocoa-40)",
      fontSize: "var(--text-xs)",
      textAlign: "center",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 22,
    color: "var(--clay)"
  })) : /*#__PURE__*/React.createElement("div", {
    style: {
      width: 52,
      height: 52,
      flex: "none",
      borderRadius: "14px",
      background: "var(--blush)",
      display: "grid",
      placeItems: "center",
      color: "var(--clay)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 24
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: "1.05rem",
      color: "var(--cocoa)",
      lineHeight: 1.2
    }
  }, service), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-xs)",
      color: "var(--cocoa-60)",
      marginTop: 3,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, studio), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginTop: 9,
      fontSize: "var(--text-xs)",
      color: "var(--cocoa-80)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "clock",
    size: 14,
    color: "var(--cocoa-60)"
  }), " ", when), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700
    }
  }, price))), status && /*#__PURE__*/React.createElement("div", {
    style: {
      alignSelf: "flex-start",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "confirmed",
    iconLeft: /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: "check",
      size: 13,
      color: "var(--eucalyptus)"
    })
  }, status)), /*#__PURE__*/React.createElement("style", null, `
        @keyframes seyBookingFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
        .sey-booking-card--float { animation: seyBookingFloat var(--dur-float,6s) var(--ease-soft) infinite; box-shadow: var(--shadow-float); }
        @media (prefers-reduced-motion: reduce) { .sey-booking-card--float { animation: none; } }
      `));
}
Object.assign(__ds_scope, { BookingCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/booking/BookingCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Button — the clay CTA and its quieter siblings.
 * Variants: primary (clay), secondary (outline), ghost, dark (on cocoa).
 */
function Button({
  children,
  variant = "primary",
  size = "md",
  as = "button",
  iconLeft,
  iconRight,
  full = false,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: {
      padding: "8px 16px",
      fontSize: "var(--text-sm)",
      radius: "var(--radius-pill)"
    },
    md: {
      padding: "12px 22px",
      fontSize: "var(--text-body)",
      radius: "var(--radius-pill)"
    },
    lg: {
      padding: "16px 30px",
      fontSize: "1.125rem",
      radius: "var(--radius-pill)"
    }
  };
  const s = sizes[size] || sizes.md;
  const variants = {
    primary: {
      background: "var(--clay)",
      color: "var(--surface)",
      border: "1px solid transparent"
    },
    secondary: {
      background: "transparent",
      color: "var(--cocoa)",
      border: "1.5px solid var(--border-strong)"
    },
    ghost: {
      background: "transparent",
      color: "var(--cocoa)",
      border: "1px solid transparent"
    },
    dark: {
      background: "var(--surface)",
      color: "var(--cocoa)",
      border: "1px solid transparent"
    }
  };
  const v = variants[variant] || variants.primary;
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: `sey-btn sey-btn--${variant}`,
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.55em",
      width: full ? "100%" : undefined,
      fontFamily: "var(--font-body)",
      fontWeight: 600,
      letterSpacing: "0.005em",
      lineHeight: 1,
      cursor: "pointer",
      textDecoration: "none",
      whiteSpace: "nowrap",
      padding: s.padding,
      fontSize: s.fontSize,
      borderRadius: s.radius,
      transition: "background var(--dur-fast) var(--ease-soft), transform var(--dur-fast) var(--ease-soft), box-shadow var(--dur-fast) var(--ease-soft), border-color var(--dur-fast) var(--ease-soft)",
      ...v,
      ...style
    }
  }, rest), iconLeft, children, iconRight, /*#__PURE__*/React.createElement("style", null, `
        .sey-btn { -webkit-tap-highlight-color: transparent; }
        .sey-btn--primary:hover { background: var(--clay-hover); }
        .sey-btn--primary:active { transform: translateY(1px); }
        .sey-btn--secondary:hover { border-color: var(--clay); color: var(--clay); }
        .sey-btn--secondary:active { transform: translateY(1px); }
        .sey-btn--ghost:hover { background: rgba(59,42,37,0.06); }
        .sey-btn--dark:hover { background: #fff; }
        .sey-btn--dark:active { transform: translateY(1px); }
      `));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/booking/SearchBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * SearchBar — the hero booking search. Treatment + location + CTA in one warm bar.
 * Collapses to stacked fields on mobile.
 */
function SearchBar({
  treatmentPlaceholder = "Treatment or studio",
  locationPlaceholder = "Anywhere on Mahé",
  datePlaceholder = "Any date",
  withDate = false,
  cta = "See open slots",
  onSubmit,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("form", _extends({
    onSubmit: e => {
      e.preventDefault();
      onSubmit && onSubmit(e);
    },
    className: "sey-searchbar",
    style: {
      display: "flex",
      alignItems: "stretch",
      gap: "8px",
      background: "var(--surface)",
      borderRadius: "var(--radius-pill)",
      boxShadow: "var(--shadow-md)",
      border: "1px solid var(--line)",
      padding: "8px",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("label", {
    className: "sey-search-field"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "search",
    size: 19,
    color: "var(--cocoa-40)"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: treatmentPlaceholder,
    "aria-label": "Treatment or studio"
  })), /*#__PURE__*/React.createElement("span", {
    className: "sey-search-divider",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("label", {
    className: "sey-search-field"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "pin",
    size: 19,
    color: "var(--cocoa-40)"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: locationPlaceholder,
    "aria-label": "Location"
  })), withDate && /*#__PURE__*/React.createElement("span", {
    className: "sey-search-divider",
    "aria-hidden": "true"
  }), withDate && /*#__PURE__*/React.createElement("label", {
    className: "sey-search-field sey-search-field--sm"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "calendar",
    size: 19,
    color: "var(--cocoa-40)"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: datePlaceholder,
    "aria-label": "Date"
  })), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    type: "submit",
    size: "md",
    style: {
      flex: "none"
    }
  }, cta), /*#__PURE__*/React.createElement("style", null, `
        .sey-search-field {
          flex: 1; min-width: 0;
          display: flex; align-items: center; gap: 10px;
          padding: 6px 18px;
          border-radius: var(--radius-pill);
          transition: background var(--dur-fast) var(--ease-soft);
        }
        .sey-search-field:focus-within { background: var(--blush); }
        .sey-search-field--sm { flex: 0.7; }
        .sey-search-field input {
          flex: 1; min-width: 0;
          border: none; outline: none; background: transparent;
          font-family: var(--font-body); font-size: var(--text-body);
          color: var(--cocoa); padding: 8px 0;
        }
        .sey-search-field input::placeholder { color: var(--cocoa-40); }
        .sey-search-divider { width: 1px; background: var(--line); margin: 8px 0; flex: none; }
        @media (max-width: 640px) {
          .sey-searchbar { flex-direction: column; border-radius: var(--radius-lg); padding: 10px; }
          .sey-search-field { border: 1px solid var(--line); }
          .sey-search-divider { display: none; }
          .sey-searchbar > button { width: 100%; }
        }
      `));
}
Object.assign(__ds_scope, { SearchBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/booking/SearchBar.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Input — warm text field with optional leading icon. Pill or soft-rect.
 */
function Input({
  iconLeft,
  shape = "rect",
  style = {},
  containerStyle = {},
  ...rest
}) {
  const radius = shape === "pill" ? "var(--radius-pill)" : "var(--radius-md)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      background: "var(--surface)",
      border: "1.5px solid var(--border)",
      borderRadius: radius,
      padding: iconLeft ? "0 16px 0 16px" : "0 16px",
      transition: "border-color var(--dur-fast) var(--ease-soft), box-shadow var(--dur-fast) var(--ease-soft)",
      ...containerStyle
    },
    className: "sey-input"
  }, iconLeft && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--cocoa-40)",
      flex: "none"
    }
  }, iconLeft), /*#__PURE__*/React.createElement("input", _extends({
    style: {
      flex: 1,
      minWidth: 0,
      appearance: "none",
      border: "none",
      outline: "none",
      background: "transparent",
      font: "inherit",
      fontFamily: "var(--font-body)",
      fontSize: "var(--text-body)",
      color: "var(--cocoa)",
      padding: "13px 0",
      ...style
    }
  }, rest)), /*#__PURE__*/React.createElement("style", null, `
        .sey-input:focus-within { border-color: var(--eucalyptus); box-shadow: var(--shadow-focus); }
        .sey-input input::placeholder { color: var(--cocoa-40); }
      `));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/SectionHeader.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * SectionHeader — eyebrow + display title (with optional italic accent word) + intro.
 * Centered or left aligned. Inverts on dark cocoa sections.
 */
function SectionHeader({
  eyebrow,
  title,
  accent,
  accentPosition = "end",
  intro,
  align = "left",
  onDark = false,
  size = "lg",
  style = {},
  ...rest
}) {
  const titleSize = size === "xl" ? "var(--text-display-lg)" : size === "md" ? "var(--text-display-md)" : "var(--text-h1)";
  const ink = onDark ? "var(--cream)" : "var(--cocoa)";
  const muted = onDark ? "var(--cream-70)" : "var(--text-muted)";
  const accentEl = accent ? /*#__PURE__*/React.createElement("em", {
    key: "a",
    style: {
      fontStyle: "normal",
      fontWeight: 500,
      color: "var(--ink)"
    }
  }, accent) : null;
  return /*#__PURE__*/React.createElement("header", _extends({
    style: {
      textAlign: align,
      maxWidth: align === "center" ? "var(--maxw-narrow)" : undefined,
      marginInline: align === "center" ? "auto" : undefined,
      ...style
    }
  }, rest), eyebrow && /*#__PURE__*/React.createElement("div", {
    className: "sey-eyebrow",
    style: {
      color: muted,
      marginBottom: "16px",
      display: "flex",
      gap: "10px",
      alignItems: "center",
      justifyContent: align === "center" ? "center" : "flex-start"
    }
  }, eyebrow), title && /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: titleSize,
      lineHeight: "var(--lh-tight)",
      letterSpacing: "var(--ls-display)",
      color: ink,
      margin: 0
    }
  }, accentPosition === "start" && accentEl, accentPosition === "start" ? " " : "", title, accentPosition === "end" ? " " : "", accentPosition === "end" && accentEl), intro && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--text-lead)",
      color: muted,
      marginTop: "18px",
      marginBottom: 0,
      maxWidth: "56ch",
      marginInline: align === "center" ? "auto" : undefined,
      lineHeight: "var(--lh-normal)"
    }
  }, intro));
}
Object.assign(__ds_scope, { SectionHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SectionHeader.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/AdminPanel.jsx
try { (() => {
// AdminPanel — internal operations dashboard for book.sey.la.
(function () {
  const {
    Icon,
    Badge,
    Button
  } = window.SeyLaBookDesignSystem_611419;
  const STATS = [{
    n: "182",
    l: "active studios",
    d: "+6 this week"
  }, {
    n: "164",
    l: "paid subscriptions",
    d: "90% of studios"
  }, {
    n: "12,418",
    l: "bookings this month",
    d: "+18% MoM"
  }, {
    n: "€3,116",
    l: "MRR",
    d: "€19 × 164"
  }];
  const BUSINESSES = [{
    name: "Kreol Spa",
    island: "Mahé",
    cat: "Spa & massage",
    plan: "Paid",
    status: "Live"
  }, {
    name: "Palm & Blade",
    island: "Mahé",
    cat: "Barber",
    plan: "Paid",
    status: "Live"
  }, {
    name: "Frangipani Nails",
    island: "Praslin",
    cat: "Nails",
    plan: "Trial",
    status: "Live"
  }, {
    name: "Island Glow",
    island: "La Digue",
    cat: "Brows & lashes",
    plan: "Trial",
    status: "Review"
  }, {
    name: "North Shore Grooming",
    island: "Mahé",
    cat: "Barber",
    plan: "Paid",
    status: "Live"
  }, {
    name: "Coco Makeup Bar",
    island: "Mahé",
    cat: "Makeup",
    plan: "Paid",
    status: "Live"
  }];
  const ACTIVITY = [{
    t: "New studio signed up",
    s: "Anse Fit · Fitness & yoga · Mahé",
    w: "12 min ago",
    ic: "sparkle"
  }, {
    t: "Subscription started",
    s: "Coco Makeup Bar · €19/mo",
    w: "1 h ago",
    ic: "heart"
  }, {
    t: "Verification requested",
    s: "Island Glow · La Digue",
    w: "3 h ago",
    ic: "shield"
  }, {
    t: "Refund processed",
    s: "Zen Shore · €19",
    w: "yesterday",
    ic: "check"
  }];
  function planTone(p) {
    return p === "Paid" ? "confirmed" : "brand";
  }
  function statusTone(s) {
    return s === "Live" ? "botanical" : s === "Review" ? "brand" : "neutral";
  }
  function AdminPanel() {
    return /*#__PURE__*/React.createElement("div", {
      className: "ad-shell"
    }, /*#__PURE__*/React.createElement("aside", {
      className: "ad-side"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ad-brand"
    }, "sey.la ", /*#__PURE__*/React.createElement("span", null, "admin")), /*#__PURE__*/React.createElement("nav", {
      className: "ad-nav"
    }, [["Overview", "sparkle", true], ["Studios", "pin", false], ["Bookings", "calendar", false], ["Payments", "heart", false], ["Reviews", "star", false], ["Settings", "shield", false]].map(([l, ic, on]) => /*#__PURE__*/React.createElement("button", {
      key: l,
      className: "ad-nav-item" + (on ? " is-active" : "")
    }, /*#__PURE__*/React.createElement(Icon, {
      name: ic,
      size: 17,
      color: on ? "var(--brass)" : "rgba(245,234,224,0.55)"
    }), " ", l))), /*#__PURE__*/React.createElement("div", {
      className: "ad-env"
    }, "Internal \xB7 book.sey.la")), /*#__PURE__*/React.createElement("main", {
      className: "ad-main"
    }, /*#__PURE__*/React.createElement("header", {
      className: "ad-top"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
      className: "ad-title"
    }, "Overview"), /*#__PURE__*/React.createElement("p", {
      className: "ad-sub"
    }, "Operations across Mah\xE9, Praslin & La Digue")), /*#__PURE__*/React.createElement("div", {
      className: "ad-top-cta"
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "confirmed"
    }, "All systems live"), /*#__PURE__*/React.createElement(Button, {
      size: "sm"
    }, "Export"))), /*#__PURE__*/React.createElement("div", {
      className: "ad-content"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ad-stats"
    }, STATS.map(s => /*#__PURE__*/React.createElement("div", {
      className: "ad-stat",
      key: s.l
    }, /*#__PURE__*/React.createElement("b", null, s.n), /*#__PURE__*/React.createElement("span", null, s.l), /*#__PURE__*/React.createElement("em", null, s.d)))), /*#__PURE__*/React.createElement("div", {
      className: "ad-grid"
    }, /*#__PURE__*/React.createElement("section", {
      className: "ad-card"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ad-card-head"
    }, /*#__PURE__*/React.createElement("h2", null, "Studios"), /*#__PURE__*/React.createElement("a", {
      href: "#"
    }, "View all \u2192")), /*#__PURE__*/React.createElement("table", {
      className: "ad-table"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Name"), /*#__PURE__*/React.createElement("th", null, "Island"), /*#__PURE__*/React.createElement("th", null, "Category"), /*#__PURE__*/React.createElement("th", null, "Plan"), /*#__PURE__*/React.createElement("th", null, "Status"))), /*#__PURE__*/React.createElement("tbody", null, BUSINESSES.map(b => /*#__PURE__*/React.createElement("tr", {
      key: b.name
    }, /*#__PURE__*/React.createElement("td", {
      className: "ad-strong"
    }, b.name), /*#__PURE__*/React.createElement("td", null, b.island), /*#__PURE__*/React.createElement("td", null, b.cat), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Badge, {
      tone: planTone(b.plan)
    }, b.plan)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Badge, {
      tone: statusTone(b.status)
    }, b.status))))))), /*#__PURE__*/React.createElement("section", {
      className: "ad-card"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ad-card-head"
    }, /*#__PURE__*/React.createElement("h2", null, "Recent activity")), /*#__PURE__*/React.createElement("ul", {
      className: "ad-activity"
    }, ACTIVITY.map((a, i) => /*#__PURE__*/React.createElement("li", {
      key: i
    }, /*#__PURE__*/React.createElement("span", {
      className: "ad-act-ic"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: a.ic,
      size: 16,
      color: "var(--clay)"
    })), /*#__PURE__*/React.createElement("span", {
      className: "ad-act-body"
    }, /*#__PURE__*/React.createElement("b", null, a.t), /*#__PURE__*/React.createElement("span", null, a.s)), /*#__PURE__*/React.createElement("span", {
      className: "ad-act-when"
    }, a.w)))))))));
  }
  window.AdminPanel = AdminPanel;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/AdminPanel.jsx", error: String((e && e.message) || e) }); }

// ui_kits/customer/CustomerAccount.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// CustomerAccount — client "My account": upcoming, past, favourites.
(function () {
  const {
    Logo,
    Button,
    Icon,
    Badge,
    BookingCard,
    StudioCard,
    ClassCard
  } = window.SeyLaBookDesignSystem_611419;
  const U = "https://images.unsplash.com/photo-";
  const UPCOMING = [{
    service: "Coconut & Frangipani massage",
    studio: "Kreol Spa · Beau Vallon",
    when: "Tomorrow · 14:30",
    price: "€55",
    status: "Confirmed",
    icon: "spa"
  }, {
    service: "Skin fade & style",
    studio: "Palm & Blade · Victoria",
    when: "Sat 4 May · 11:00",
    price: "€22",
    status: "Confirmed",
    icon: "barber"
  }];
  const PAST = [{
    service: "Signature facial",
    studio: "Island Glow · La Digue",
    when: "12 Apr · 16:00",
    price: "€48",
    status: "Completed",
    icon: "sparkle"
  }, {
    service: "Gel manicure",
    studio: "Frangipani Nails · Praslin",
    when: "28 Mar · 10:30",
    price: "€25",
    status: "Completed",
    icon: "nails"
  }];
  const FAVES = [{
    name: "Kreol Spa",
    location: "Beau Vallon, Mahé",
    category: "Spa & massage",
    image: U + "1519823551278-64ac92734fb1",
    rating: 4.9,
    reviews: 214,
    services: [{
      name: "Coconut & Frangipani massage",
      duration: "60 min",
      price: "€55"
    }]
  }, {
    name: "Palm & Blade",
    location: "Victoria, Mahé",
    category: "Barber",
    image: U + "1512864084360-7c0c4d0a0845",
    rating: 4.8,
    reviews: 132,
    services: [{
      name: "Skin fade & style",
      duration: "40 min",
      price: "€22"
    }]
  }, {
    name: "Zen Shore",
    location: "Anse Royale, Mahé",
    category: "Spa & massage",
    image: U + "1696841212541-449ca29397cc",
    rating: 5.0,
    reviews: 87,
    services: [{
      name: "Hot stone therapy",
      duration: "75 min",
      price: "€65"
    }]
  }];
  function ApptRow({
    b,
    actions
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: "ca-appt"
    }, /*#__PURE__*/React.createElement(BookingCard, _extends({}, b, {
      style: {
        maxWidth: "none"
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "ca-appt-actions"
    }, actions));
  }
  function CustomerAccount() {
    const [tab, setTab] = React.useState("upcoming");
    const TABS = [["upcoming", "Upcoming"], ["past", "Past"], ["favourites", "Favourites"]];
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("header", {
      className: "ca-nav"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sey-container ca-nav-inner"
    }, /*#__PURE__*/React.createElement(Logo, null), /*#__PURE__*/React.createElement("div", {
      className: "ca-nav-right"
    }, /*#__PURE__*/React.createElement("a", {
      href: "/search"
    }, "Browse"), /*#__PURE__*/React.createElement("span", {
      className: "ca-avatar"
    }, "S")))), /*#__PURE__*/React.createElement("section", {
      className: "ca-head"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sey-container"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ca-hello"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "sey-eyebrow ca-eyebrow"
    }, "My account"), /*#__PURE__*/React.createElement("h1", {
      className: "ca-title"
    }, "Hi, ", /*#__PURE__*/React.createElement("em", {
      className: "sey-accent-italic"
    }, "Sofia"))), /*#__PURE__*/React.createElement(Button, {
      as: "a",
      href: "/search"
    }, "Book something new")), /*#__PURE__*/React.createElement("div", {
      className: "ca-tabs",
      role: "tablist"
    }, TABS.map(([k, l]) => /*#__PURE__*/React.createElement("button", {
      key: k,
      role: "tab",
      "aria-selected": tab === k,
      className: "ca-tab" + (tab === k ? " is-active" : ""),
      onClick: () => setTab(k)
    }, l))))), /*#__PURE__*/React.createElement("section", {
      className: "ca-body"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sey-container"
    }, tab === "upcoming" && /*#__PURE__*/React.createElement("div", {
      className: "ca-list"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ca-sub"
    }, "Appointments"), UPCOMING.map((b, i) => /*#__PURE__*/React.createElement(ApptRow, {
      key: i,
      b: b,
      actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        variant: "secondary",
        size: "sm"
      }, "Reschedule"), /*#__PURE__*/React.createElement("button", {
        className: "ca-link"
      }, "Cancel"))
    })), /*#__PURE__*/React.createElement("div", {
      className: "ca-note"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "clock",
      size: 15,
      color: "var(--eucalyptus)"
    }), " Free to cancel up to 12 hours before your visit."), /*#__PURE__*/React.createElement("div", {
      className: "ca-sub",
      style: {
        marginTop: "18px"
      }
    }, "Booked classes"), /*#__PURE__*/React.createElement(ClassCard, {
      day: "Mon",
      time: "07:00",
      name: "Sunrise beach yoga",
      instructor: "Kreol Spa \xB7 with Aline",
      duration: "60 min",
      level: "All levels",
      price: "\u20AC18",
      spotsLeft: 6,
      capacity: 14
    }), /*#__PURE__*/React.createElement(ClassCard, {
      day: "Sat",
      time: "08:00",
      name: "Personal training \xB7 small group",
      instructor: "North Shore Fitness \xB7 with Denis",
      duration: "45 min",
      level: "Intermediate",
      price: "\u20AC25",
      spotsLeft: 2,
      capacity: 6
    })), tab === "past" && /*#__PURE__*/React.createElement("div", {
      className: "ca-list"
    }, PAST.map((b, i) => /*#__PURE__*/React.createElement(ApptRow, {
      key: i,
      b: b,
      actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        variant: "secondary",
        size: "sm"
      }, "Rebook"), /*#__PURE__*/React.createElement("button", {
        className: "ca-link"
      }, "Leave a review"))
    }))), tab === "favourites" && /*#__PURE__*/React.createElement("div", {
      className: "ca-faves"
    }, FAVES.map(s => /*#__PURE__*/React.createElement(StudioCard, _extends({
      key: s.name
    }, s)))))));
  }
  window.CustomerAccount = CustomerAccount;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/customer/CustomerAccount.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/Categories.jsx
try { (() => {
// Categories — the service categories with line icons. Universal, single grid.
(function () {
  const {
    CategoryTile,
    SectionHeader
  } = window.SeyLaBookDesignSystem_611419;
  const CATEGORIES = [{
    icon: "hair",
    label: "Hair",
    count: 32
  }, {
    icon: "barber",
    label: "Barber",
    count: 12
  }, {
    icon: "nails",
    label: "Nails",
    count: 21
  }, {
    icon: "brows",
    label: "Brows & lashes",
    count: 18
  }, {
    icon: "spa",
    label: "Spa & massage",
    count: 24
  }, {
    icon: "skin",
    label: "Skin & facial",
    count: 16
  }, {
    icon: "makeup",
    label: "Makeup",
    count: 9
  }, {
    icon: "waxing",
    label: "Waxing",
    count: 11
  }, {
    icon: "tattoo",
    label: "Tattoo",
    count: 8
  }, {
    icon: "piercing",
    label: "Piercing",
    count: 6
  }, {
    icon: "fitness",
    label: "Fitness & yoga",
    count: 14
  }, {
    icon: "trainer",
    label: "Personal trainer",
    count: 10
  }];
  function Categories() {
    return /*#__PURE__*/React.createElement("section", {
      className: "lp-section",
      id: "categories"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sey-container"
    }, /*#__PURE__*/React.createElement(SectionHeader, {
      eyebrow: "Book by what you need",
      title: "Every kind of care",
      intro: "From a beachside massage to a sharp fade before dinner \u2014 browse verified studios by service."
    }), /*#__PURE__*/React.createElement("div", {
      className: "lp-cats"
    }, CATEGORIES.map(c => /*#__PURE__*/React.createElement(CategoryTile, {
      key: c.label,
      icon: c.icon,
      label: c.label,
      count: c.count
    })))));
  }
  window.Categories = Categories;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/Categories.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/FeaturedStudios.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// FeaturedStudios — marketplace "recommended" grid of venues (Fresha/Booksy style).
(function () {
  const {
    StudioCard,
    SectionHeader,
    Button
  } = window.SeyLaBookDesignSystem_611419;
  const U = "https://images.unsplash.com/photo-";
  const STUDIOS = [{
    name: "Kreol Spa",
    location: "Beau Vallon, Mahé",
    category: "Spa & massage",
    image: U + "1519823551278-64ac92734fb1",
    rating: 4.9,
    reviews: 214,
    badge: "Popular",
    services: [{
      name: "Coconut & Frangipani massage",
      duration: "60 min",
      price: "€55"
    }, {
      name: "Aroma back & neck",
      duration: "30 min",
      price: "€30"
    }]
  }, {
    name: "Palm & Blade",
    location: "Victoria, Mahé",
    category: "Barber",
    image: U + "1512864084360-7c0c4d0a0845",
    rating: 4.8,
    reviews: 132,
    badge: "Loved by locals",
    services: [{
      name: "Skin fade & style",
      duration: "40 min",
      price: "€22"
    }, {
      name: "Beard trim & hot towel",
      duration: "25 min",
      price: "€16"
    }]
  }, {
    name: "Lumière Studio",
    location: "Victoria, Mahé",
    category: "Hair",
    image: U + "1632765866070-3fadf25d3d5b",
    rating: 4.8,
    reviews: 176,
    services: [{
      name: "Cut & blow-dry",
      duration: "45 min",
      price: "€30"
    }, {
      name: "Braids & styling",
      duration: "120 min",
      price: "€60"
    }]
  }, {
    name: "Frangipani Nails",
    location: "Grand Anse, Praslin",
    category: "Nails",
    image: U + "1632345031435-8727f6897d53",
    rating: 4.9,
    reviews: 98,
    services: [{
      name: "Gel manicure",
      duration: "45 min",
      price: "€25"
    }, {
      name: "Spa pedicure",
      duration: "60 min",
      price: "€35"
    }]
  }, {
    name: "Island Glow",
    location: "La Digue",
    category: "Brows & lashes",
    image: U + "1632765854612-9b02b6ec2b15",
    rating: 4.7,
    reviews: 64,
    badge: "New",
    services: [{
      name: "Signature facial",
      duration: "50 min",
      price: "€48"
    }, {
      name: "Brow lamination",
      duration: "40 min",
      price: "€35"
    }]
  }, {
    name: "North Shore Grooming",
    location: "Beau Vallon, Mahé",
    category: "Barber & grooming",
    image: U + "1699641975121-5c3f55a553e5",
    rating: 4.9,
    reviews: 121,
    services: [{
      name: "Cut, beard & hot towel",
      duration: "45 min",
      price: "€26"
    }, {
      name: "Deep-tissue back & neck",
      duration: "30 min",
      price: "€32"
    }]
  }, {
    name: "Zen Shore",
    location: "Anse Royale, Mahé",
    category: "Spa",
    image: U + "1696841212541-449ca29397cc",
    rating: 5.0,
    reviews: 87,
    services: [{
      name: "Hot stone therapy",
      duration: "75 min",
      price: "€65"
    }, {
      name: "Scalp ritual",
      duration: "30 min",
      price: "€30"
    }]
  }, {
    name: "Takamaka Wellness",
    location: "Takamaka, Mahé",
    category: "Spa & massage",
    image: U + "1570172619644-dfd03ed5d881",
    rating: 4.8,
    reviews: 73,
    services: [{
      name: "Volcanic clay facial",
      duration: "50 min",
      price: "€44"
    }, {
      name: "Sports recovery massage",
      duration: "60 min",
      price: "€58"
    }]
  }];
  function FeaturedStudios() {
    return /*#__PURE__*/React.createElement("section", {
      className: "lp-section",
      id: "studios-featured"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sey-container"
    }, /*#__PURE__*/React.createElement("div", {
      className: "lp-featured-head"
    }, /*#__PURE__*/React.createElement(SectionHeader, {
      eyebrow: "Recommended near you",
      title: "Top-rated island",
      accent: "studios.",
      intro: "Verified salons and spas booking through sey.la right now, sorted by what locals and travellers love."
    }), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      className: "lp-featured-cta"
    }, "See all studios")), /*#__PURE__*/React.createElement("div", {
      className: "lp-featured"
    }, STUDIOS.map(s => /*#__PURE__*/React.createElement(StudioCard, _extends({
      key: s.name
    }, s))))));
  }
  window.FeaturedStudios = FeaturedStudios;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/FeaturedStudios.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/FinalCTA.jsx
try { (() => {
// FinalCTA + Footer — closing call to action and footer (no sey.la family).
(function () {
  const {
    Button,
    SearchBar,
    Logo,
    Icon
  } = window.SeyLaBookDesignSystem_611419;
  function FinalCTA() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("section", {
      className: "lp-section lp-final"
    }, /*#__PURE__*/React.createElement("div", {
      className: "lp-bloom lp-bloom--final",
      "aria-hidden": "true"
    }), /*#__PURE__*/React.createElement("div", {
      className: "sey-container lp-final-inner"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "lp-final-title"
    }, "Your next ", /*#__PURE__*/React.createElement("em", {
      className: "sey-accent-italic"
    }, "cut, massage or ritual"), " is one search away."), /*#__PURE__*/React.createElement("p", {
      className: "lp-final-lead"
    }, "See open slots near you right now \u2014 it's free."), /*#__PURE__*/React.createElement("div", {
      className: "lp-final-search"
    }, /*#__PURE__*/React.createElement(SearchBar, {
      cta: "Find a studio"
    })))), /*#__PURE__*/React.createElement("footer", {
      className: "lp-footer",
      id: "studios"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sey-container"
    }, /*#__PURE__*/React.createElement("div", {
      className: "lp-footer-top lp-footer-top--simple"
    }, /*#__PURE__*/React.createElement("div", {
      className: "lp-footer-brand"
    }, /*#__PURE__*/React.createElement(Logo, {
      color: "var(--cream)",
      mono: true
    }), /*#__PURE__*/React.createElement("p", null, "Real-time booking for beauty & wellness across the Seychelles."), /*#__PURE__*/React.createElement("a", {
      className: "lp-footer-studios",
      href: "#"
    }, "List your studio ", /*#__PURE__*/React.createElement(Icon, {
      name: "arrowRight",
      size: 16
    }))), /*#__PURE__*/React.createElement("nav", {
      className: "lp-footer-nav",
      "aria-label": "Footer"
    }, /*#__PURE__*/React.createElement("a", {
      href: "#categories"
    }, "Explore"), /*#__PURE__*/React.createElement("a", {
      href: "#studios-featured"
    }, "Featured studios"), /*#__PURE__*/React.createElement("a", {
      href: "#how"
    }, "How it works"), /*#__PURE__*/React.createElement("a", {
      href: "#trust"
    }, "Why sey.la"))), /*#__PURE__*/React.createElement("div", {
      className: "lp-footer-bottom"
    }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 sey.la"), /*#__PURE__*/React.createElement("div", {
      className: "lp-footer-links"
    }, /*#__PURE__*/React.createElement("a", {
      href: "#"
    }, "Privacy"), /*#__PURE__*/React.createElement("a", {
      href: "#"
    }, "Terms"), /*#__PURE__*/React.createElement("a", {
      href: "#"
    }, "Support"))))));
  }
  window.FinalCTA = FinalCTA;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/FinalCTA.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/Hero.jsx
try { (() => {
// Hero — marketplace search-first hero (Fresha/Booksy style) with a warm photo montage.
(function () {
  const {
    SearchBar,
    BookingCard,
    Icon
  } = window.SeyLaBookDesignSystem_611419;
  const POPULAR = ["Massage", "Hair", "Nails", "Barber", "Facial", "Yoga"];
  const U = "https://images.unsplash.com/photo-";
  function Hero() {
    return /*#__PURE__*/React.createElement("section", {
      className: "lp-hero"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sey-container lp-hero-grid"
    }, /*#__PURE__*/React.createElement("div", {
      className: "lp-hero-copy lp-fade"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sey-eyebrow lp-hero-eyebrow"
    }, "Mah\xE9 \xB7 Praslin \xB7 La Digue"), /*#__PURE__*/React.createElement("h1", {
      className: "lp-hero-title"
    }, "Book beauty & wellness across the Seychelles."), /*#__PURE__*/React.createElement("p", {
      className: "lp-hero-lead"
    }, "Search verified local studios, see real-time availability, and book in seconds \u2014 always free for you."), /*#__PURE__*/React.createElement("div", {
      className: "lp-hero-search"
    }, /*#__PURE__*/React.createElement(SearchBar, {
      withDate: true,
      cta: "Search"
    })), /*#__PURE__*/React.createElement("div", {
      className: "lp-hero-popular"
    }, /*#__PURE__*/React.createElement("span", {
      className: "lp-hero-popular-label"
    }, "Popular"), POPULAR.map(p => /*#__PURE__*/React.createElement("a", {
      key: p,
      href: "#categories",
      className: "lp-chip"
    }, p))), /*#__PURE__*/React.createElement("div", {
      className: "lp-hero-trust"
    }, /*#__PURE__*/React.createElement("span", {
      className: "lp-hero-rating"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "star",
      size: 16,
      color: "var(--ink)"
    }), /*#__PURE__*/React.createElement("b", null, "4.9"), " from 12,000+ island bookings"), /*#__PURE__*/React.createElement("span", {
      className: "lp-hero-free"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "heart",
      size: 15,
      color: "var(--cocoa-60)"
    }), " Free for clients"))), /*#__PURE__*/React.createElement("div", {
      className: "lp-hero-montage lp-fade lp-fade--2",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("img", {
      className: "lp-m lp-m--a",
      src: U + "1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=70",
      alt: "",
      loading: "lazy"
    }), /*#__PURE__*/React.createElement("img", {
      className: "lp-m lp-m--b",
      src: U + "1512864084360-7c0c4d0a0845?auto=format&fit=crop&w=440&q=70",
      alt: "",
      loading: "lazy"
    }), /*#__PURE__*/React.createElement("img", {
      className: "lp-m lp-m--c",
      src: U + "1632765854612-9b02b6ec2b15?auto=format&fit=crop&w=440&q=70",
      alt: "",
      loading: "lazy"
    }), /*#__PURE__*/React.createElement("img", {
      className: "lp-m lp-m--d",
      src: U + "1699641975121-5c3f55a553e5?auto=format&fit=crop&w=440&q=70",
      alt: "",
      loading: "lazy"
    }), /*#__PURE__*/React.createElement("div", {
      className: "lp-hero-floatcard"
    }, /*#__PURE__*/React.createElement(BookingCard, {
      service: "Coconut & Frangipani massage",
      studio: "Kreol Spa \xB7 Beau Vallon",
      when: "Tomorrow \xB7 14:30",
      price: "\u20AC55",
      status: "Confirmed",
      float: true,
      style: {
        maxWidth: "none"
      }
    })))));
  }
  window.Hero = Hero;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/HowItWorks.jsx
try { (() => {
// HowItWorks — 3 steps on the dark cocoa band.
(function () {
  const {
    StepCard,
    SectionHeader,
    Icon
  } = window.SeyLaBookDesignSystem_611419;
  function HowItWorks() {
    return /*#__PURE__*/React.createElement("section", {
      className: "lp-section lp-cocoa",
      id: "how"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sey-container"
    }, /*#__PURE__*/React.createElement(SectionHeader, {
      onDark: true,
      eyebrow: "Booked in seconds",
      title: "How it",
      accent: "works.",
      intro: "No calls, no waiting. Real calendars from real studios, updated live."
    }), /*#__PURE__*/React.createElement("div", {
      className: "lp-steps"
    }, /*#__PURE__*/React.createElement(StepCard, {
      step: "01",
      title: "Find a studio",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "search"
      })
    }, "Search verified salons and spas near you across Mah\xE9, Praslin and La Digue."), /*#__PURE__*/React.createElement(StepCard, {
      step: "02",
      title: "Pick a slot",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "calendar"
      })
    }, "See real-time availability and choose the time that suits your day."), /*#__PURE__*/React.createElement(StepCard, {
      step: "03",
      title: "Show up",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "check"
      })
    }, "Get instant confirmation, then simply arrive and enjoy your ritual."))));
  }
  window.HowItWorks = HowItWorks;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/HowItWorks.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/Nav.jsx
try { (() => {
// Nav — sticky translucent shell nav with logo, family switcher, links, log in.
(function () {
  const {
    Logo,
    Button,
    Icon
  } = window.SeyLaBookDesignSystem_611419;
  function Nav() {
    const [open, setOpen] = React.useState(false);
    return /*#__PURE__*/React.createElement("header", {
      className: "lp-nav"
    }, /*#__PURE__*/React.createElement("div", {
      className: "lp-nav-inner sey-container"
    }, /*#__PURE__*/React.createElement("div", {
      className: "lp-nav-left"
    }, /*#__PURE__*/React.createElement(Logo, null)), /*#__PURE__*/React.createElement("nav", {
      className: "lp-nav-links",
      "aria-label": "Primary"
    }, /*#__PURE__*/React.createElement("a", {
      href: "#categories"
    }, "Explore"), /*#__PURE__*/React.createElement("a", {
      href: "#how"
    }, "How it works"), /*#__PURE__*/React.createElement("a", {
      href: "#studios"
    }, "For studios"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm"
    }, "Log in")), /*#__PURE__*/React.createElement("button", {
      className: "lp-nav-burger",
      "aria-label": "Menu",
      "aria-expanded": open,
      onClick: () => setOpen(v => !v)
    }, /*#__PURE__*/React.createElement(Icon, {
      name: open ? "close" : "menu"
    }))), open && /*#__PURE__*/React.createElement("div", {
      className: "lp-nav-mobile sey-container"
    }, /*#__PURE__*/React.createElement("a", {
      href: "#categories",
      onClick: () => setOpen(false)
    }, "Explore"), /*#__PURE__*/React.createElement("a", {
      href: "#how",
      onClick: () => setOpen(false)
    }, "How it works"), /*#__PURE__*/React.createElement("a", {
      href: "#studios",
      onClick: () => setOpen(false)
    }, "For studios"), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      full: true
    }, "Log in")));
  }
  window.Nav = Nav;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/Nav.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/PhotoStrip.jsx
try { (() => {
// PhotoStrip — full-bleed band of warm-treated photos, interleaved between sections.
(function () {
  const U = "https://images.unsplash.com/photo-";
  const DEFAULT = [{
    src: U + "1512864084360-7c0c4d0a0845",
    alt: "Barber lining up a fresh cut"
  }, {
    src: U + "1519699047748-de8e457a634e",
    alt: "Client after a hair appointment"
  }, {
    src: U + "1544161515-4ab6ce6db874",
    alt: "Massage at a spa"
  }, {
    src: U + "1699641975121-5c3f55a553e5",
    alt: "Man getting a haircut"
  }, {
    src: U + "1632765854612-9b02b6ec2b15",
    alt: "Client at a beauty studio"
  }];
  function PhotoStrip({
    caption,
    photos = DEFAULT
  }) {
    return /*#__PURE__*/React.createElement("section", {
      className: "lp-photostrip",
      "aria-label": caption || "Studios on the islands"
    }, caption && /*#__PURE__*/React.createElement("div", {
      className: "lp-photostrip-caption sey-eyebrow"
    }, caption), /*#__PURE__*/React.createElement("div", {
      className: "lp-photostrip-row"
    }, photos.map((p, i) => /*#__PURE__*/React.createElement("figure", {
      className: "lp-photostrip-cell",
      key: i
    }, /*#__PURE__*/React.createElement("img", {
      src: p.src + "?auto=format&fit=crop&w=600&q=70",
      alt: p.alt,
      loading: "lazy"
    })))));
  }
  window.PhotoStrip = PhotoStrip;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/PhotoStrip.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/Trust.jsx
try { (() => {
// Trust — 4 reassurance points on shell-alt.
(function () {
  const {
    TrustPoint,
    SectionHeader,
    Icon
  } = window.SeyLaBookDesignSystem_611419;
  function Trust() {
    return /*#__PURE__*/React.createElement("section", {
      className: "lp-section lp-alt",
      id: "trust"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sey-container"
    }, /*#__PURE__*/React.createElement(SectionHeader, {
      eyebrow: "Calm, by design",
      title: "Booking you can",
      accent: "trust."
    }), /*#__PURE__*/React.createElement("div", {
      className: "lp-trust"
    }, /*#__PURE__*/React.createElement(TrustPoint, {
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "shield"
      }),
      title: "Verified local studios"
    }, "Only vetted salons and spas across the Seychelles \u2014 no chains, no surprises."), /*#__PURE__*/React.createElement(TrustPoint, {
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "heart"
      }),
      title: "Always free for you"
    }, "No booking fees, ever. You pay the studio for the service, nothing more."), /*#__PURE__*/React.createElement(TrustPoint, {
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "clock"
      }),
      title: "Real-time calendars"
    }, "Availability comes straight from each studio's live calendar."), /*#__PURE__*/React.createElement(TrustPoint, {
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "calendar"
      }),
      title: "Cancel free"
    }, "Change your mind? Cancel free up to 12 hours before your visit."))));
  }
  window.Trust = Trust;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/Trust.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile/App.jsx
try { (() => {
// sey.la | book — mobile PWA. Full client app: discover, search+map, studio profile,
// booking flow, classes, bookings, favourites, account/OTP, notifications.
(function () {
  const {
    Ic,
    Stars
  } = window.SEY_UI;
  const D = window.SEY_DATA;
  const {
    useState,
    useEffect,
    useRef
  } = React;

  // ---------- persistence ----------
  const load = (k, f) => {
    try {
      return JSON.parse(localStorage.getItem("sey." + k)) ?? f;
    } catch {
      return f;
    }
  };
  const save = (k, v) => {
    try {
      localStorage.setItem("sey." + k, JSON.stringify(v));
    } catch {}
  };

  // ---------- small pieces ----------
  function TopBar({
    title,
    onBack,
    right,
    brand
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: "topbar"
    }, onBack && /*#__PURE__*/React.createElement("button", {
      className: "iconbtn iconbtn--plain topbar-back",
      onClick: onBack,
      "aria-label": "Back"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "back"
    })), brand ? /*#__PURE__*/React.createElement("div", {
      className: "brand"
    }, /*#__PURE__*/React.createElement("b", null, "sey.la"), /*#__PURE__*/React.createElement("span", null, "|"), /*#__PURE__*/React.createElement("i", null, "book")) : /*#__PURE__*/React.createElement("div", {
      className: "topbar-title"
    }, title), /*#__PURE__*/React.createElement("div", {
      className: "topbar-spacer"
    }), right);
  }
  function StudioCard({
    s,
    onOpen,
    fav,
    onFav,
    wide
  }) {
    return /*#__PURE__*/React.createElement("button", {
      className: "scard",
      onClick: onOpen
    }, /*#__PURE__*/React.createElement("div", {
      className: "scard-photo"
    }, /*#__PURE__*/React.createElement("img", {
      src: s.photo,
      alt: s.name,
      loading: "lazy"
    }), /*#__PURE__*/React.createElement("span", {
      className: "scard-tag"
    }, s.tag), /*#__PURE__*/React.createElement("span", {
      className: "scard-fav" + (fav ? " is-on" : ""),
      role: "button",
      "aria-label": "Save",
      onClick: ev => {
        ev.stopPropagation();
        onFav(s.id);
      }
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "heart",
      size: 18,
      fill: fav ? "var(--clay)" : "none",
      color: fav ? "var(--clay)" : "var(--ink)"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "scard-body"
    }, /*#__PURE__*/React.createElement("div", {
      className: "scard-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "scard-name"
    }, s.name), /*#__PURE__*/React.createElement(Stars, {
      r: s.rating
    })), /*#__PURE__*/React.createElement("div", {
      className: "scard-meta"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "pin",
      size: 13,
      color: "var(--cocoa-40)"
    }), s.area, /*#__PURE__*/React.createElement("i", {
      className: "dotsep"
    }), s.distance, /*#__PURE__*/React.createElement("i", {
      className: "dotsep"
    }), s.price)));
  }
  function ClassCard({
    c,
    onJoin,
    joined
  }) {
    const pct = Math.round((c.cap - c.spots) / c.cap * 100);
    const low = c.spots <= 3;
    return /*#__PURE__*/React.createElement("div", {
      className: "class"
    }, /*#__PURE__*/React.createElement("div", {
      className: "class-top"
    }, /*#__PURE__*/React.createElement("div", {
      className: "class-time"
    }, /*#__PURE__*/React.createElement("div", {
      className: "t"
    }, c.time), /*#__PURE__*/React.createElement("div", {
      className: "d"
    }, c.day)), /*#__PURE__*/React.createElement("div", {
      className: "class-info"
    }, /*#__PURE__*/React.createElement("div", {
      className: "scard-name"
    }, c.name), /*#__PURE__*/React.createElement("div", {
      className: "srv-meta"
    }, c.studio, " \xB7 ", c.instructor), /*#__PURE__*/React.createElement("div", {
      className: "scard-meta"
    }, c.dur, /*#__PURE__*/React.createElement("i", {
      className: "dotsep"
    }), c.level, /*#__PURE__*/React.createElement("i", {
      className: "dotsep"
    }), "\u20AC", c.price))), /*#__PURE__*/React.createElement("div", {
      className: "spots" + (low ? " spots--low" : "")
    }, /*#__PURE__*/React.createElement("i", {
      style: {
        width: pct + "%"
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "spots-lb"
    }, /*#__PURE__*/React.createElement("span", {
      className: "muted"
    }, /*#__PURE__*/React.createElement("b", null, c.spots, " spots"), " left of ", c.cap), /*#__PURE__*/React.createElement("button", {
      className: "srv-add" + (joined ? " is-on" : ""),
      onClick: () => onJoin(c)
    }, joined ? "Joined ✓" : "Join class")));
  }

  // ---------- HOME ----------
  function Home({
    nav,
    favs,
    toggleFav,
    setTab,
    notif
  }) {
    const near = D.STUDIOS;
    const rec = D.STUDIOS.slice().sort((a, b) => b.rating - a.rating);
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TopBar, {
      brand: true,
      right: /*#__PURE__*/React.createElement("button", {
        className: "iconbtn iconbtn--plain bell",
        "aria-label": "Notifications",
        onClick: () => nav.push("notif")
      }, /*#__PURE__*/React.createElement(Ic, {
        name: "bell"
      }), notif && /*#__PURE__*/React.createElement("span", {
        className: "dot"
      }))
    }), /*#__PURE__*/React.createElement("div", {
      className: "app-scroll"
    }, /*#__PURE__*/React.createElement("div", {
      className: "screen"
    }, /*#__PURE__*/React.createElement("div", {
      className: "block--flush fu"
    }, /*#__PURE__*/React.createElement("div", {
      className: "eyebrow",
      style: {
        marginBottom: 6
      }
    }, "Mah\xE9 \xB7 Praslin \xB7 La Digue"), /*#__PURE__*/React.createElement("h1", {
      className: "h-xl"
    }, "Book your island ritual.")), /*#__PURE__*/React.createElement("div", {
      className: "block--flush"
    }, /*#__PURE__*/React.createElement("button", {
      className: "searchfield",
      onClick: () => setTab("search")
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "search",
      size: 20,
      color: "var(--cocoa-60)"
    }), "Studios, services, treatments\u2026")), /*#__PURE__*/React.createElement("div", {
      className: "block"
    }, /*#__PURE__*/React.createElement("div", {
      className: "catrail"
    }, D.CATEGORIES.map(c => /*#__PURE__*/React.createElement("button", {
      key: c.id,
      className: "cat",
      onClick: () => nav.push("search", {
        cat: c.id
      })
    }, /*#__PURE__*/React.createElement("span", {
      className: "cat-ic"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: c.icon,
      size: 26
    })), /*#__PURE__*/React.createElement("span", {
      className: "cat-lb"
    }, c.label))))), /*#__PURE__*/React.createElement("div", {
      className: "block"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sec-title"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "h-md"
    }, "Recommended"), /*#__PURE__*/React.createElement("a", {
      onClick: () => setTab("search")
    }, "See all")), /*#__PURE__*/React.createElement("div", {
      className: "hscroll"
    }, rec.map(s => /*#__PURE__*/React.createElement(StudioCard, {
      key: s.id,
      s: s,
      wide: true,
      onOpen: () => nav.push("studio", {
        id: s.id
      }),
      fav: favs.includes(s.id),
      onFav: toggleFav
    })))), /*#__PURE__*/React.createElement("div", {
      className: "block"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sec-title"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "h-md"
    }, "Group classes"), /*#__PURE__*/React.createElement("a", {
      onClick: () => nav.push("classes")
    }, "See all")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 12
      }
    }, D.CLASSES.slice(0, 2).map(c => /*#__PURE__*/React.createElement(ClassCard, {
      key: c.id,
      c: c,
      joined: false,
      onJoin: cl => nav.push("classJoin", {
        id: cl.id
      })
    })))), /*#__PURE__*/React.createElement("div", {
      className: "block"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sec-title"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "h-md"
    }, "Near you"), /*#__PURE__*/React.createElement("a", {
      onClick: () => setTab("search")
    }, "Map")), /*#__PURE__*/React.createElement("div", {
      className: "slist"
    }, near.map(s => /*#__PURE__*/React.createElement(StudioCard, {
      key: s.id,
      s: s,
      onOpen: () => nav.push("studio", {
        id: s.id
      }),
      fav: favs.includes(s.id),
      onFav: toggleFav
    })))))));
  }

  // ---------- SEARCH (+ filters + map) ----------
  function Search({
    nav,
    favs,
    toggleFav,
    initialCat
  }) {
    const [cat, setCat] = useState(initialCat || "all");
    const [mode, setMode] = useState("list"); // list | map
    const [active, setActive] = useState(null);
    const list = cat === "all" ? D.STUDIOS : D.STUDIOS.filter(s => s.cat === cat);
    const cats = [{
      id: "all",
      label: "All"
    }].concat(D.CATEGORIES.map(c => ({
      id: c.id,
      label: c.label
    })));
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TopBar, {
      title: "Browse",
      right: /*#__PURE__*/React.createElement("button", {
        className: "iconbtn iconbtn--plain",
        onClick: () => setMode(mode === "list" ? "map" : "list"),
        "aria-label": "Toggle map"
      }, /*#__PURE__*/React.createElement(Ic, {
        name: mode === "list" ? "pin" : "filter"
      }))
    }), /*#__PURE__*/React.createElement("div", {
      className: "screen",
      style: {
        paddingTop: 4,
        paddingBottom: 10
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "searchfield",
      onClick: () => {}
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "search",
      size: 20,
      color: "var(--cocoa-60)"
    }), /*#__PURE__*/React.createElement("input", {
      placeholder: "Search Beau Vallon\u2026",
      onClick: e => e.stopPropagation()
    })), /*#__PURE__*/React.createElement("div", {
      className: "chips",
      style: {
        marginTop: 12
      }
    }, cats.map(c => /*#__PURE__*/React.createElement("button", {
      key: c.id,
      className: "chip" + (cat === c.id ? " is-active" : ""),
      onClick: () => setCat(c.id)
    }, c.label)))), mode === "list" ? /*#__PURE__*/React.createElement("div", {
      className: "app-scroll",
      style: {
        paddingTop: 4
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "screen"
    }, /*#__PURE__*/React.createElement("div", {
      className: "muted tiny",
      style: {
        margin: "2px 0 12px"
      }
    }, list.length, " studios \xB7 sorted by rating"), /*#__PURE__*/React.createElement("div", {
      className: "slist"
    }, list.map(s => /*#__PURE__*/React.createElement(StudioCard, {
      key: s.id,
      s: s,
      onOpen: () => nav.push("studio", {
        id: s.id
      }),
      fav: favs.includes(s.id),
      onFav: toggleFav
    }))))) : /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        position: "relative"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "map"
    }, /*#__PURE__*/React.createElement("div", {
      className: "map-water"
    }), /*#__PURE__*/React.createElement("div", {
      className: "map-road",
      style: {
        left: "20%",
        top: 0,
        width: 3,
        height: "100%"
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "map-road",
      style: {
        left: 0,
        top: "48%",
        width: "100%",
        height: 3
      }
    }), list.map(s => /*#__PURE__*/React.createElement("div", {
      key: s.id,
      className: "pin-marker" + (active === s.id ? " is-active" : ""),
      style: {
        left: s.x + "%",
        top: s.y + "%"
      },
      onClick: () => setActive(s.id)
    }, /*#__PURE__*/React.createElement("span", {
      className: "pin-price"
    }, s.price, " \xB7 ", s.rating)))), active && (() => {
      const s = list.find(x => x.id === active) || D.STUDIOS.find(x => x.id === active);
      return /*#__PURE__*/React.createElement("div", {
        style: {
          position: "absolute",
          left: 14,
          right: 14,
          bottom: 14
        }
      }, /*#__PURE__*/React.createElement(StudioCard, {
        s: s,
        onOpen: () => nav.push("studio", {
          id: s.id
        }),
        fav: favs.includes(s.id),
        onFav: toggleFav
      }));
    })()));
  }

  // ---------- STUDIO PROFILE ----------
  function Studio({
    id,
    nav,
    favs,
    toggleFav
  }) {
    const s = D.STUDIOS.find(x => x.id === id);
    const classes = D.CLASSES.filter(c => c.studioId === id);
    const [tab, setTab] = useState("services");
    return /*#__PURE__*/React.createElement("div", {
      className: "sheet-full"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative"
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: s.photo.replace("w=600", "w=800"),
      alt: s.name,
      style: {
        width: "100%",
        height: 230,
        objectFit: "cover",
        filter: "var(--photo-filter)"
      }
    }), /*#__PURE__*/React.createElement("button", {
      className: "iconbtn topbar-back",
      style: {
        position: "absolute",
        top: 14,
        left: 14
      },
      onClick: nav.pop,
      "aria-label": "Back"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "back"
    })), /*#__PURE__*/React.createElement("button", {
      className: "iconbtn",
      style: {
        position: "absolute",
        top: 14,
        right: 14
      },
      "aria-label": "Share"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "share",
      size: 19
    })), /*#__PURE__*/React.createElement("button", {
      className: "iconbtn",
      style: {
        position: "absolute",
        top: 14,
        right: 66
      },
      onClick: () => toggleFav(s.id),
      "aria-label": "Save"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "heart",
      size: 19,
      fill: favs.includes(s.id) ? "var(--clay)" : "none",
      color: favs.includes(s.id) ? "var(--clay)" : "var(--ink)"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "app-scroll",
      style: {
        paddingBottom: 100
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "screen",
      style: {
        paddingTop: 16
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "scard-tag",
      style: {
        position: "static",
        display: "inline-block",
        marginBottom: 8
      }
    }, s.tag), /*#__PURE__*/React.createElement("h1", {
      className: "h-lg"
    }, s.name), /*#__PURE__*/React.createElement("div", {
      className: "scard-meta",
      style: {
        marginTop: 8,
        fontSize: "0.9rem"
      }
    }, /*#__PURE__*/React.createElement(Stars, {
      r: s.rating
    }), " ", /*#__PURE__*/React.createElement("b", {
      style: {
        color: "var(--ink)"
      }
    }, s.rating), " (", s.reviews, ")", /*#__PURE__*/React.createElement("i", {
      className: "dotsep"
    }), /*#__PURE__*/React.createElement(Ic, {
      name: "pin",
      size: 13,
      color: "var(--cocoa-40)"
    }), s.area), /*#__PURE__*/React.createElement("p", {
      className: "muted",
      style: {
        marginTop: 12,
        lineHeight: 1.55
      }
    }, s.about), /*#__PURE__*/React.createElement("div", {
      className: "chips",
      style: {
        marginTop: 6,
        marginBottom: 4
      }
    }, ["services", classes.length ? "classes" : null, "reviews", "about"].filter(Boolean).map(t => /*#__PURE__*/React.createElement("button", {
      key: t,
      className: "chip" + (tab === t ? " is-active" : ""),
      onClick: () => setTab(t),
      style: {
        textTransform: "capitalize"
      }
    }, t))), tab === "services" && s.services.map(g => /*#__PURE__*/React.createElement("div", {
      className: "block--flush",
      key: g.g
    }, /*#__PURE__*/React.createElement("div", {
      className: "eyebrow",
      style: {
        marginBottom: 4
      }
    }, g.g), g.items.map(it => /*#__PURE__*/React.createElement("div", {
      className: "srv",
      key: it.id,
      onClick: () => nav.push("book", {
        id: s.id,
        serviceId: it.id
      })
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "srv-name"
    }, it.name), /*#__PURE__*/React.createElement("div", {
      className: "srv-meta"
    }, it.dur)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "srv-price"
    }, "\u20AC", it.price), /*#__PURE__*/React.createElement(Ic, {
      name: "chevronRight",
      size: 18,
      color: "var(--cocoa-40)"
    })))))), tab === "classes" && /*#__PURE__*/React.createElement("div", {
      className: "block--flush",
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 12
      }
    }, classes.map(c => /*#__PURE__*/React.createElement(ClassCard, {
      key: c.id,
      c: c,
      joined: false,
      onJoin: cl => nav.push("classJoin", {
        id: cl.id
      })
    }))), tab === "reviews" && /*#__PURE__*/React.createElement("div", {
      className: "block--flush"
    }, D.REVIEWS.map((r, i) => /*#__PURE__*/React.createElement("div", {
      className: "review",
      key: i
    }, /*#__PURE__*/React.createElement("div", {
      className: "review-head"
    }, /*#__PURE__*/React.createElement("img", {
      className: "review-av",
      src: r.av,
      alt: ""
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("b", null, r.name), /*#__PURE__*/React.createElement("div", {
      className: "tiny muted"
    }, r.when)), /*#__PURE__*/React.createElement("span", {
      className: "rating"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "star",
      size: 13,
      fill: "var(--ink)",
      color: "var(--ink)"
    }), " ", r.rating, ".0")), /*#__PURE__*/React.createElement("p", {
      className: "muted",
      style: {
        margin: 0,
        lineHeight: 1.5
      }
    }, r.text)))), tab === "about" && /*#__PURE__*/React.createElement("div", {
      className: "block--flush"
    }, /*#__PURE__*/React.createElement("div", {
      className: "eyebrow",
      style: {
        marginBottom: 8
      }
    }, "Opening hours"), s.hours.map((h, i) => /*#__PURE__*/React.createElement("div", {
      className: "hours-row" + (i === s.todayIdx ? " today" : ""),
      key: h[0]
    }, /*#__PURE__*/React.createElement("span", null, h[0], i === s.todayIdx ? " · Today" : ""), /*#__PURE__*/React.createElement("span", null, h[1]))), /*#__PURE__*/React.createElement("div", {
      className: "eyebrow",
      style: {
        margin: "18px 0 8px"
      }
    }, "Gallery"), /*#__PURE__*/React.createElement("div", {
      className: "gallery"
    }, s.gallery.map((g, i) => /*#__PURE__*/React.createElement("img", {
      key: i,
      src: g,
      alt: "",
      loading: "lazy"
    })))))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        padding: "12px 18px calc(12px + env(safe-area-inset-bottom,0px))",
        background: "color-mix(in srgb, var(--surface) 94%, transparent)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid var(--line)"
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn--primary btn--full",
      onClick: () => nav.push("book", {
        id: s.id
      })
    }, "Book now")));
  }

  // ---------- BOOKING FLOW (service -> staff -> time -> payment -> confirm) ----------
  function BookFlow({
    id,
    serviceId,
    nav,
    addBooking,
    prefill
  }) {
    const s = D.STUDIOS.find(x => x.id === id);
    const allItems = s.services.flatMap(g => g.items);
    const staffPool = D.STAFF.slice(0, 3);
    const [picked, setPicked] = useState(serviceId ? [serviceId] : prefill ? prefill.picked : []);
    const [staff, setStaff] = useState("any");
    const [day, setDay] = useState(0);
    const [slot, setSlot] = useState(null);
    const [recurring, setRecurring] = useState(false);
    const [pay, setPay] = useState("salon"); // salon | now
    const [step, setStep] = useState(serviceId || prefill ? 1 : 0); // 0 svc,1 staff,2 time,3 pay
    const [done, setDone] = useState(false);
    const chosen = allItems.filter(it => picked.includes(it.id));
    const total = chosen.reduce((n, it) => n + it.price, 0);
    const deposit = pay === "now" ? Math.max(5, Math.round(total * 0.2)) : 0;
    const staffName = staff === "any" ? "Any professional" : (staffPool.find(p => p.id === staff) || {}).name;
    const TITLES = ["Choose services", "Choose professional", "Pick a time", "Payment"];
    function confirm() {
      addBooking({
        id: "bk" + Date.now(),
        studioId: s.id,
        studio: s.name,
        area: s.area,
        service: chosen.map(c => c.name).join(", ") || "Appointment",
        staff: staffName,
        pay,
        deposit,
        recurring,
        when: (D.DAYS[day].d === "Today" ? "Today" : D.DAYS[day].d) + " · " + slot,
        price: total,
        status: "Confirmed",
        photo: s.photo,
        past: false
      });
      setDone(true);
    }
    if (done) {
      return /*#__PURE__*/React.createElement("div", {
        className: "sheet-full"
      }, /*#__PURE__*/React.createElement("div", {
        className: "app-scroll"
      }, /*#__PURE__*/React.createElement("div", {
        className: "confirm"
      }, /*#__PURE__*/React.createElement("div", {
        className: "confirm-ic"
      }, /*#__PURE__*/React.createElement(Ic, {
        name: "check",
        size: 38,
        color: "var(--eucalyptus)"
      })), /*#__PURE__*/React.createElement("h1", {
        className: "h-lg"
      }, "You're booked"), /*#__PURE__*/React.createElement("p", {
        className: "muted",
        style: {
          margin: 0
        }
      }, "A confirmation is on its way. Free to cancel up to 12h before."), /*#__PURE__*/React.createElement("div", {
        className: "receipt"
      }, /*#__PURE__*/React.createElement("div", {
        className: "receipt-row"
      }, /*#__PURE__*/React.createElement("span", {
        className: "k"
      }, "Studio"), /*#__PURE__*/React.createElement("span", {
        className: "v"
      }, s.name)), /*#__PURE__*/React.createElement("div", {
        className: "receipt-row"
      }, /*#__PURE__*/React.createElement("span", {
        className: "k"
      }, "Service"), /*#__PURE__*/React.createElement("span", {
        className: "v"
      }, chosen.map(c => c.name).join(", "))), /*#__PURE__*/React.createElement("div", {
        className: "receipt-row"
      }, /*#__PURE__*/React.createElement("span", {
        className: "k"
      }, "With"), /*#__PURE__*/React.createElement("span", {
        className: "v"
      }, staffName)), /*#__PURE__*/React.createElement("div", {
        className: "receipt-row"
      }, /*#__PURE__*/React.createElement("span", {
        className: "k"
      }, "When"), /*#__PURE__*/React.createElement("span", {
        className: "v"
      }, D.DAYS[day].d, " \xB7 ", slot, recurring ? " · repeats" : "")), /*#__PURE__*/React.createElement("div", {
        className: "receipt-row"
      }, /*#__PURE__*/React.createElement("span", {
        className: "k"
      }, "Payment"), /*#__PURE__*/React.createElement("span", {
        className: "v"
      }, pay === "now" ? "€" + deposit + " deposit paid" : "Pay in salon")), /*#__PURE__*/React.createElement("div", {
        className: "receipt-row"
      }, /*#__PURE__*/React.createElement("span", {
        className: "k"
      }, "Total"), /*#__PURE__*/React.createElement("span", {
        className: "v"
      }, "\u20AC", total))))), /*#__PURE__*/React.createElement("div", {
        style: {
          padding: "12px 18px calc(12px + env(safe-area-inset-bottom,0px))"
        }
      }, /*#__PURE__*/React.createElement("button", {
        className: "btn btn--primary btn--full",
        onClick: () => nav.reset("bookings")
      }, "View my bookings")));
    }
    return /*#__PURE__*/React.createElement("div", {
      className: "sheet-full"
    }, /*#__PURE__*/React.createElement(TopBar, {
      title: TITLES[step],
      onBack: step === 0 ? nav.pop : () => setStep(step - 1)
    }), /*#__PURE__*/React.createElement("div", {
      className: "app-scroll",
      style: {
        paddingBottom: 118
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "screen"
    }, /*#__PURE__*/React.createElement("div", {
      className: "stepdots"
    }, [0, 1, 2, 3].map(i => /*#__PURE__*/React.createElement("span", {
      key: i,
      className: "stepdot" + (i <= step ? " is-on" : "")
    }))), /*#__PURE__*/React.createElement("div", {
      className: "muted tiny",
      style: {
        marginBottom: 4
      }
    }, s.name, " \xB7 ", s.area), step === 0 && s.services.map(g => /*#__PURE__*/React.createElement("div", {
      className: "block--flush",
      key: g.g
    }, /*#__PURE__*/React.createElement("div", {
      className: "eyebrow",
      style: {
        marginBottom: 4
      }
    }, g.g), g.items.map(it => {
      const on = picked.includes(it.id);
      return /*#__PURE__*/React.createElement("div", {
        className: "srv",
        key: it.id
      }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        className: "srv-name"
      }, it.name), /*#__PURE__*/React.createElement("div", {
        className: "srv-meta"
      }, it.dur, " \xB7 \u20AC", it.price)), /*#__PURE__*/React.createElement("button", {
        className: "srv-add" + (on ? " is-on" : ""),
        onClick: () => setPicked(on ? picked.filter(p => p !== it.id) : [...picked, it.id])
      }, on ? "Added ✓" : "Add"));
    }))), step === 1 && /*#__PURE__*/React.createElement("div", {
      className: "block--flush"
    }, /*#__PURE__*/React.createElement("button", {
      className: "staffcard" + (staff === "any" ? " is-on" : ""),
      onClick: () => setStaff("any")
    }, /*#__PURE__*/React.createElement("span", {
      className: "staff-any"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "sparkle",
      size: 20,
      color: "var(--ink)"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "appt-name"
    }, "Any professional"), /*#__PURE__*/React.createElement("div", {
      className: "srv-meta"
    }, "Earliest availability")), staff === "any" && /*#__PURE__*/React.createElement(Ic, {
      name: "check",
      size: 18,
      color: "var(--ink)"
    })), staffPool.map(p => /*#__PURE__*/React.createElement("button", {
      key: p.id,
      className: "staffcard" + (staff === p.id ? " is-on" : ""),
      onClick: () => setStaff(p.id)
    }, /*#__PURE__*/React.createElement("img", {
      src: p.av,
      alt: ""
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "appt-name"
    }, p.name), /*#__PURE__*/React.createElement("div", {
      className: "srv-meta"
    }, p.role)), /*#__PURE__*/React.createElement("span", {
      className: "rating",
      style: {
        marginRight: 6
      }
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "star",
      size: 13,
      fill: "var(--ink)",
      color: "var(--ink)"
    }), " ", p.rating), staff === p.id && /*#__PURE__*/React.createElement(Ic, {
      name: "check",
      size: 18,
      color: "var(--ink)"
    })))), step === 2 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "block--flush"
    }, /*#__PURE__*/React.createElement("div", {
      className: "eyebrow",
      style: {
        marginBottom: 8
      }
    }, "Day", staff !== "any" ? " · " + staffName + "'s calendar" : ""), /*#__PURE__*/React.createElement("div", {
      className: "daystrip"
    }, D.DAYS.map((d, i) => /*#__PURE__*/React.createElement("button", {
      key: i,
      className: "day" + (day === i ? " is-active" : ""),
      onClick: () => {
        setDay(i);
        setSlot(null);
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "day-d"
    }, d.d), /*#__PURE__*/React.createElement("div", {
      className: "day-n"
    }, d.n))))), /*#__PURE__*/React.createElement("div", {
      className: "block--flush"
    }, /*#__PURE__*/React.createElement("div", {
      className: "eyebrow",
      style: {
        marginBottom: 8
      }
    }, "Available times"), /*#__PURE__*/React.createElement("div", {
      className: "slotgrid"
    }, D.SLOTS.map((t, i) => {
      const taken = day === 0 && D.TAKEN.includes(t) || staff !== "any" && i % 3 === 2;
      return /*#__PURE__*/React.createElement("button", {
        key: t,
        className: "slot" + (slot === t ? " is-active" : ""),
        disabled: taken,
        onClick: () => setSlot(t)
      }, t);
    }))), /*#__PURE__*/React.createElement("label", {
      className: "togglerow"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "srv-name"
    }, "Repeat this appointment"), /*#__PURE__*/React.createElement("div", {
      className: "srv-meta"
    }, "Every 4 weeks \xB7 cancel anytime")), /*#__PURE__*/React.createElement("span", {
      className: "switch" + (recurring ? " is-on" : ""),
      onClick: () => setRecurring(!recurring)
    }, /*#__PURE__*/React.createElement("i", null)))), step === 3 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "block--flush"
    }, /*#__PURE__*/React.createElement("div", {
      className: "eyebrow",
      style: {
        marginBottom: 8
      }
    }, "Payment"), /*#__PURE__*/React.createElement("button", {
      className: "paymethod" + (pay === "salon" ? " is-on" : ""),
      onClick: () => setPay("salon")
    }, /*#__PURE__*/React.createElement("span", {
      className: "arow-ic"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "pin",
      size: 19
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "srv-name"
    }, "Pay in salon"), /*#__PURE__*/React.createElement("div", {
      className: "srv-meta"
    }, "Free booking \xB7 pay after your visit")), pay === "salon" && /*#__PURE__*/React.createElement(Ic, {
      name: "check",
      size: 18,
      color: "var(--ink)"
    })), /*#__PURE__*/React.createElement("button", {
      className: "paymethod" + (pay === "now" ? " is-on" : ""),
      onClick: () => setPay("now")
    }, /*#__PURE__*/React.createElement("span", {
      className: "arow-ic"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "card",
      size: 19
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "srv-name"
    }, "Pay a deposit now"), /*#__PURE__*/React.createElement("div", {
      className: "srv-meta"
    }, "Secures your slot \xB7 Visa \xB7\xB7\xB7\xB7 4291")), pay === "now" && /*#__PURE__*/React.createElement(Ic, {
      name: "check",
      size: 18,
      color: "var(--ink)"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "paynote"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "shield",
      size: 16,
      color: "var(--eucalyptus)"
    }), " ", pay === "now" ? "€" + deposit + " deposit today, €" + (total - deposit) + " in salon. Refundable if you cancel 12h before." : "No card needed. A no-show may limit future free bookings."), /*#__PURE__*/React.createElement("div", {
      className: "receipt",
      style: {
        marginTop: 4
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "receipt-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, chosen.length, " service", chosen.length > 1 ? "s" : ""), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, "\u20AC", total)), /*#__PURE__*/React.createElement("div", {
      className: "receipt-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "With"), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, staffName)), /*#__PURE__*/React.createElement("div", {
      className: "receipt-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "When"), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, D.DAYS[day].d, " \xB7 ", slot)), deposit > 0 && /*#__PURE__*/React.createElement("div", {
      className: "receipt-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "Due now"), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, "\u20AC", deposit)))))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        padding: "12px 18px calc(12px + env(safe-area-inset-bottom,0px))",
        background: "color-mix(in srgb, var(--surface) 94%, transparent)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid var(--line)"
      }
    }, step === 0 && /*#__PURE__*/React.createElement("button", {
      className: "btn btn--primary btn--full",
      disabled: !picked.length,
      onClick: () => setStep(1)
    }, "Continue", total ? " · €" + total : ""), step === 1 && /*#__PURE__*/React.createElement("button", {
      className: "btn btn--primary btn--full",
      onClick: () => setStep(2)
    }, "Continue"), step === 2 && /*#__PURE__*/React.createElement("button", {
      className: "btn btn--primary btn--full",
      disabled: !slot,
      onClick: () => setStep(3)
    }, "Continue ", slot ? "· " + D.DAYS[day].d + " " + slot : ""), step === 3 && /*#__PURE__*/React.createElement("button", {
      className: "btn btn--primary btn--full",
      onClick: confirm
    }, pay === "now" ? "Pay €" + deposit + " & confirm" : "Confirm booking")));
  }

  // ---------- CLASS JOIN ----------
  function ClassJoin({
    id,
    nav,
    joinClass,
    joinedIds
  }) {
    const c = D.CLASSES.find(x => x.id === id);
    const joined = joinedIds.includes(c.id);
    const pct = Math.round((c.cap - c.spots) / c.cap * 100);
    return /*#__PURE__*/React.createElement("div", {
      className: "sheet-full"
    }, /*#__PURE__*/React.createElement(TopBar, {
      title: "Group class",
      onBack: nav.pop
    }), /*#__PURE__*/React.createElement("div", {
      className: "app-scroll"
    }, /*#__PURE__*/React.createElement("div", {
      className: "screen"
    }, /*#__PURE__*/React.createElement("h1", {
      className: "h-lg",
      style: {
        marginTop: 8
      }
    }, c.name), /*#__PURE__*/React.createElement("div", {
      className: "muted",
      style: {
        marginTop: 6
      }
    }, c.studio, " \xB7 ", c.instructor), /*#__PURE__*/React.createElement("div", {
      className: "receipt",
      style: {
        marginTop: 18
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "receipt-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "When"), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, c.day, " \xB7 ", c.time)), /*#__PURE__*/React.createElement("div", {
      className: "receipt-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "Duration"), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, c.dur)), /*#__PURE__*/React.createElement("div", {
      className: "receipt-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "Level"), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, c.level)), /*#__PURE__*/React.createElement("div", {
      className: "receipt-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "Price"), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, "\u20AC", c.price))), /*#__PURE__*/React.createElement("div", {
      className: "block--flush"
    }, /*#__PURE__*/React.createElement("div", {
      className: "spots" + (c.spots <= 3 ? " spots--low" : "")
    }, /*#__PURE__*/React.createElement("i", {
      style: {
        width: pct + "%"
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "spots-lb"
    }, /*#__PURE__*/React.createElement("span", {
      className: "muted"
    }, /*#__PURE__*/React.createElement("b", null, c.spots, " spots"), " left of ", c.cap), /*#__PURE__*/React.createElement("span", {
      className: "muted"
    }, pct, "% full"))))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "12px 18px calc(12px + env(safe-area-inset-bottom,0px))"
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn--primary btn--full",
      disabled: joined,
      onClick: () => {
        joinClass(c);
        nav.pop();
      }
    }, joined ? "Already joined ✓" : "Join class · €" + c.price)));
  }

  // ---------- CLASSES LIST ----------
  function Classes({
    nav
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: "sheet-full"
    }, /*#__PURE__*/React.createElement(TopBar, {
      title: "Group classes",
      onBack: nav.pop
    }), /*#__PURE__*/React.createElement("div", {
      className: "app-scroll"
    }, /*#__PURE__*/React.createElement("div", {
      className: "screen",
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 12,
        paddingTop: 6
      }
    }, D.CLASSES.map(c => /*#__PURE__*/React.createElement(ClassCard, {
      key: c.id,
      c: c,
      joined: false,
      onJoin: cl => nav.push("classJoin", {
        id: cl.id
      })
    })))));
  }

  // ---------- BOOKINGS ----------
  function Bookings({
    bookings,
    nav,
    onManage,
    reviewed
  }) {
    const [tab, setTab] = useState("upcoming");
    const up = bookings.filter(b => !b.past);
    const past = bookings.filter(b => b.past);
    const list = tab === "upcoming" ? up : past;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TopBar, {
      title: "My bookings"
    }), /*#__PURE__*/React.createElement("div", {
      className: "screen",
      style: {
        paddingBottom: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "chips"
    }, /*#__PURE__*/React.createElement("button", {
      className: "chip" + (tab === "upcoming" ? " is-active" : ""),
      onClick: () => setTab("upcoming")
    }, "Upcoming (", up.length, ")"), /*#__PURE__*/React.createElement("button", {
      className: "chip" + (tab === "past" ? " is-active" : ""),
      onClick: () => setTab("past")
    }, "History (", past.length, ")"))), /*#__PURE__*/React.createElement("div", {
      className: "app-scroll",
      style: {
        paddingTop: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "screen",
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 12
      }
    }, list.length === 0 ? /*#__PURE__*/React.createElement("div", {
      className: "empty"
    }, /*#__PURE__*/React.createElement("div", {
      className: "empty-ic"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "calendar",
      size: 26
    })), /*#__PURE__*/React.createElement("div", {
      className: "h-md",
      style: {
        marginBottom: 4
      }
    }, "Nothing here yet"), /*#__PURE__*/React.createElement("p", {
      className: "muted",
      style: {
        margin: 0
      }
    }, "When you book, it shows up here.")) : list.map(b => /*#__PURE__*/React.createElement("div", {
      key: b.id
    }, /*#__PURE__*/React.createElement("div", {
      className: "bk",
      onClick: () => b.past ? nav.push("studio", {
        id: b.studioId
      }) : onManage(b)
    }, /*#__PURE__*/React.createElement("img", {
      className: "bk-photo",
      src: b.photo,
      alt: ""
    }), /*#__PURE__*/React.createElement("div", {
      className: "bk-info"
    }, /*#__PURE__*/React.createElement("div", {
      className: "bk-when"
    }, b.when), /*#__PURE__*/React.createElement("div", {
      className: "bk-name"
    }, b.service), /*#__PURE__*/React.createElement("div", {
      className: "bk-sub"
    }, b.studio, " \xB7 \u20AC", b.price)), /*#__PURE__*/React.createElement("span", {
      className: "status " + (b.past ? "status--past" : "status--ok")
    }, b.status)), b.past && /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8,
        marginTop: 8
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn--soft btn--sm",
      onClick: () => nav.push("book", {
        id: b.studioId
      })
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "calendar",
      size: 15
    }), " Book again"), reviewed.includes(b.id) ? /*#__PURE__*/React.createElement("div", {
      className: "tiny muted",
      style: {
        display: "flex",
        gap: 5,
        alignItems: "center",
        alignSelf: "center"
      }
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "check",
      size: 14,
      color: "var(--eucalyptus)"
    }), " Reviewed") : /*#__PURE__*/React.createElement("button", {
      className: "btn btn--soft btn--sm",
      onClick: () => nav.push("review", {
        bookingId: b.id
      })
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "star",
      size: 15
    }), " Review")))), tab === "upcoming" && up.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "muted tiny",
      style: {
        display: "flex",
        gap: 6,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 4
      }
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "clock",
      size: 14,
      color: "var(--eucalyptus)"
    }), " Tap a booking to reschedule or cancel \xB7 free up to 12h before."))));
  }

  // ---------- FAVOURITES ----------
  function Favourites({
    favs,
    toggleFav,
    nav
  }) {
    const list = D.STUDIOS.filter(s => favs.includes(s.id));
    return /*#__PURE__*/React.createElement("div", {
      className: "sheet-full"
    }, /*#__PURE__*/React.createElement(TopBar, {
      title: "Favourites",
      onBack: nav.pop
    }), /*#__PURE__*/React.createElement("div", {
      className: "app-scroll"
    }, /*#__PURE__*/React.createElement("div", {
      className: "screen"
    }, list.length === 0 ? /*#__PURE__*/React.createElement("div", {
      className: "empty"
    }, /*#__PURE__*/React.createElement("div", {
      className: "empty-ic"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "heart",
      size: 26
    })), /*#__PURE__*/React.createElement("div", {
      className: "h-md",
      style: {
        marginBottom: 4
      }
    }, "No favourites yet"), /*#__PURE__*/React.createElement("p", {
      className: "muted",
      style: {
        margin: 0
      }
    }, "Tap the heart on any studio to save it.")) : /*#__PURE__*/React.createElement("div", {
      className: "slist"
    }, list.map(s => /*#__PURE__*/React.createElement(StudioCard, {
      key: s.id,
      s: s,
      onOpen: () => nav.push("studio", {
        id: s.id
      }),
      fav: true,
      onFav: toggleFav
    }))))));
  }

  // ---------- NOTIFICATIONS ----------
  function Notifications({
    nav
  }) {
    const items = [{
      ic: "calendar",
      t: "Reminder: Coconut & frangipani massage",
      s: "Tomorrow at 14:30 · Kreol Spa",
      when: "2h ago",
      dot: true
    }, {
      ic: "check",
      t: "Booking confirmed",
      s: "Sunrise beach yoga · Sat 07:00",
      when: "1d ago",
      dot: true
    }, {
      ic: "sparkle",
      t: "A slot opened at L'Accent Barber",
      s: "Today 16:00 — you were watching this",
      when: "2d ago"
    }, {
      ic: "heart",
      t: "Lumière Nails added a new service",
      s: "BIAB overlay · €42",
      when: "5d ago"
    }];
    return /*#__PURE__*/React.createElement("div", {
      className: "sheet-full"
    }, /*#__PURE__*/React.createElement(TopBar, {
      title: "Notifications",
      onBack: nav.pop
    }), /*#__PURE__*/React.createElement("div", {
      className: "app-scroll"
    }, /*#__PURE__*/React.createElement("div", {
      className: "screen"
    }, items.map((n, i) => /*#__PURE__*/React.createElement("div", {
      className: "arow",
      key: i
    }, /*#__PURE__*/React.createElement("span", {
      className: "arow-ic"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: n.ic,
      size: 20
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 600,
        color: "var(--ink)"
      }
    }, n.t), /*#__PURE__*/React.createElement("div", {
      className: "tiny muted",
      style: {
        marginTop: 2
      }
    }, n.s)), /*#__PURE__*/React.createElement("div", {
      className: "tiny muted",
      style: {
        whiteSpace: "nowrap"
      }
    }, n.when))))));
  }

  // ---------- ACCOUNT + LOGIN/OTP ----------
  function Account({
    user,
    setUser,
    favs,
    nav,
    notif,
    setNotif
  }) {
    if (!user) return /*#__PURE__*/React.createElement(Login, {
      onDone: setUser
    });
    const rows = [{
      ic: "sparkle",
      lb: "Rewards & stamps",
      go: () => nav.push("rewards")
    }, {
      ic: "calendar",
      lb: "Messages",
      go: () => nav.push("messages")
    }, {
      ic: "card",
      lb: "Packages & gift cards",
      go: () => nav.push("packages")
    }, {
      ic: "clock",
      lb: "Waitlist",
      go: () => nav.push("waitlist")
    }, {
      ic: "heart",
      lb: "Favourites",
      go: () => nav.push("favs")
    }, {
      ic: "sparkle",
      lb: "Invite a studio · €15",
      go: () => nav.push("invite")
    }, {
      ic: "bell",
      lb: "Notifications",
      go: () => nav.push("notif")
    }, {
      ic: "card",
      lb: "Payment methods"
    }, {
      ic: "globe",
      lb: "Language · English"
    }, {
      ic: "help",
      lb: "Help & support"
    }];
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TopBar, {
      title: "Account"
    }), /*#__PURE__*/React.createElement("div", {
      className: "app-scroll"
    }, /*#__PURE__*/React.createElement("div", {
      className: "screen"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "10px 0 18px"
      }
    }, /*#__PURE__*/React.createElement("img", {
      className: "avatar",
      src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=70",
      alt: ""
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "h-md"
    }, user.name), /*#__PURE__*/React.createElement("div", {
      className: "tiny muted"
    }, user.phone))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        background: "var(--surface)",
        border: "1px solid var(--line)",
        borderRadius: "var(--radius-lg)",
        padding: "14px",
        textAlign: "center"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "h-md"
    }, favs.length), /*#__PURE__*/React.createElement("div", {
      className: "tiny muted"
    }, "Saved")), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        background: "var(--surface)",
        border: "1px solid var(--line)",
        borderRadius: "var(--radius-lg)",
        padding: "14px",
        textAlign: "center"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "h-md"
    }, "4.9"), /*#__PURE__*/React.createElement("div", {
      className: "tiny muted"
    }, "Your rating"))), /*#__PURE__*/React.createElement("div", {
      className: "block--flush"
    }, rows.map(r => /*#__PURE__*/React.createElement("div", {
      className: "arow",
      key: r.lb,
      onClick: r.go
    }, /*#__PURE__*/React.createElement("span", {
      className: "arow-ic"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: r.ic,
      size: 20
    })), /*#__PURE__*/React.createElement("span", {
      className: "arow-lb"
    }, r.lb), /*#__PURE__*/React.createElement(Ic, {
      name: "chevronRight",
      size: 18,
      color: "var(--cocoa-40)"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "arow",
      onClick: () => setNotif(!notif)
    }, /*#__PURE__*/React.createElement("span", {
      className: "arow-ic"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "bell",
      size: 20
    })), /*#__PURE__*/React.createElement("span", {
      className: "arow-lb"
    }, "Push reminders"), /*#__PURE__*/React.createElement("span", {
      style: {
        width: 46,
        height: 28,
        borderRadius: 999,
        background: notif ? "var(--ink)" : "var(--line-strong)",
        position: "relative",
        transition: "background .2s"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        top: 3,
        left: notif ? 21 : 3,
        width: 22,
        height: 22,
        borderRadius: "50%",
        background: "#fff",
        transition: "left .2s"
      }
    })))), /*#__PURE__*/React.createElement("button", {
      className: "btn btn--soft btn--full",
      style: {
        marginTop: 18
      },
      onClick: () => setUser(null)
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "logout",
      size: 18
    }), " Log out"), /*#__PURE__*/React.createElement("p", {
      className: "tiny muted",
      style: {
        textAlign: "center",
        marginTop: 20
      }
    }, "sey.la | book \xB7 always free for clients", /*#__PURE__*/React.createElement("br", null), "Operated by Nexora Consulting LLC"))));
  }
  function Login({
    onDone
  }) {
    const [step, setStep] = useState("phone");
    const [phone, setPhone] = useState("");
    const [code, setCode] = useState(["", "", "", ""]);
    const refs = [useRef(), useRef(), useRef(), useRef()];
    function setDigit(i, v) {
      if (!/^\d?$/.test(v)) return;
      const next = code.slice();
      next[i] = v;
      setCode(next);
      if (v && i < 3) refs[i + 1].current && refs[i + 1].current.focus();
      if (next.every(d => d)) setTimeout(() => onDone({
        name: "Amelia Rose",
        phone: "+248 " + (phone || "251 0000")
      }), 350);
    }
    return /*#__PURE__*/React.createElement("div", {
      className: "app-scroll",
      style: {
        paddingBottom: 24
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "screen",
      style: {
        paddingTop: 40
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "brand",
      style: {
        fontSize: "1.4rem",
        marginBottom: 28
      }
    }, /*#__PURE__*/React.createElement("b", null, "sey.la"), /*#__PURE__*/React.createElement("span", null, "|"), /*#__PURE__*/React.createElement("i", null, "book")), step === "phone" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h1", {
      className: "h-lg"
    }, "Log in or sign up"), /*#__PURE__*/React.createElement("p", {
      className: "muted",
      style: {
        marginTop: 8
      }
    }, "Enter your phone number \u2014 we'll text a one-time code. Booking is always free."), /*#__PURE__*/React.createElement("div", {
      className: "field",
      style: {
        marginTop: 22
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "field-prefix"
    }, "\uD83C\uDDF8\uD83C\uDDE8 +248"), /*#__PURE__*/React.createElement("input", {
      inputMode: "numeric",
      placeholder: "251 0000",
      value: phone,
      onChange: e => setPhone(e.target.value)
    })), /*#__PURE__*/React.createElement("button", {
      className: "btn btn--primary btn--full",
      style: {
        marginTop: 18
      },
      disabled: phone.length < 6,
      onClick: () => setStep("otp")
    }, "Continue"), /*#__PURE__*/React.createElement("p", {
      className: "tiny muted",
      style: {
        marginTop: 16,
        lineHeight: 1.5
      }
    }, "By continuing you agree to the Terms and Privacy Policy.")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "iconbtn iconbtn--plain",
      style: {
        marginLeft: -6,
        marginBottom: 6
      },
      onClick: () => setStep("phone"),
      "aria-label": "Back"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "back"
    })), /*#__PURE__*/React.createElement("h1", {
      className: "h-lg"
    }, "Enter the code"), /*#__PURE__*/React.createElement("p", {
      className: "muted",
      style: {
        marginTop: 8
      }
    }, "Sent to +248 ", phone || "251 0000", ". ", /*#__PURE__*/React.createElement("a", {
      style: {
        color: "var(--ink)",
        fontWeight: 600
      },
      onClick: () => {}
    }, "Resend")), /*#__PURE__*/React.createElement("div", {
      className: "otp"
    }, code.map((d, i) => /*#__PURE__*/React.createElement("input", {
      key: i,
      ref: refs[i],
      inputMode: "numeric",
      maxLength: 1,
      value: d,
      autoFocus: i === 0,
      onChange: e => setDigit(i, e.target.value),
      onKeyDown: e => {
        if (e.key === "Backspace" && !d && i > 0) refs[i - 1].current.focus();
      }
    }))), /*#__PURE__*/React.createElement("p", {
      className: "tiny muted",
      style: {
        textAlign: "center"
      }
    }, "Tip: type any 4 digits to continue."))));
  }

  // ---------- LOYALTY / REWARDS ----------
  function LoyaltyCard({
    l
  }) {
    const cells = Array.from({
      length: l.need
    }, (_, i) => i);
    return /*#__PURE__*/React.createElement("div", {
      className: "loy"
    }, /*#__PURE__*/React.createElement("div", {
      className: "loy-head"
    }, /*#__PURE__*/React.createElement("img", {
      src: l.photo,
      alt: ""
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "scard-name"
    }, l.studio), /*#__PURE__*/React.createElement("div", {
      className: "loy-progress"
    }, l.have, " of ", l.need, " visits")), /*#__PURE__*/React.createElement(Stars, {
      r: 5
    })), /*#__PURE__*/React.createElement("div", {
      className: "loy-body"
    }, /*#__PURE__*/React.createElement("div", {
      className: "stamps"
    }, cells.map(i => {
      const on = i < l.have,
        reward = i === l.need - 1;
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        className: "stamp" + (on ? " is-on" : "") + (reward && !on ? " is-reward" : "")
      }, reward ? /*#__PURE__*/React.createElement(Ic, {
        name: "sparkle",
        size: 16,
        color: on ? "#fff" : "var(--clay)"
      }) : on ? /*#__PURE__*/React.createElement(Ic, {
        name: "check",
        size: 15,
        color: "#fff"
      }) : /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 12,
          fontWeight: 700
        }
      }, i + 1));
    })), /*#__PURE__*/React.createElement("div", {
      className: "loy-reward"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "sparkle",
      size: 16,
      color: "var(--clay)"
    }), " Reward: ", l.reward)));
  }
  function Rewards({
    nav
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: "sheet-full"
    }, /*#__PURE__*/React.createElement(TopBar, {
      title: "Rewards",
      onBack: nav.pop
    }), /*#__PURE__*/React.createElement("div", {
      className: "app-scroll"
    }, /*#__PURE__*/React.createElement("div", {
      className: "screen",
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 14,
        paddingTop: 6
      }
    }, /*#__PURE__*/React.createElement("p", {
      className: "muted",
      style: {
        margin: "0 0 2px"
      }
    }, "Collect a stamp on every visit. Rewards apply automatically at checkout."), D.LOYALTY.map(l => /*#__PURE__*/React.createElement(LoyaltyCard, {
      key: l.studioId,
      l: l
    })))));
  }

  // ---------- POST-VISIT REVIEW ----------
  function ReviewFlow({
    booking,
    nav,
    onSubmit
  }) {
    const [r, setR] = useState(5);
    const [txt, setTxt] = useState("");
    const [done, setDone] = useState(false);
    if (done) return /*#__PURE__*/React.createElement("div", {
      className: "sheet-full"
    }, /*#__PURE__*/React.createElement("div", {
      className: "app-scroll"
    }, /*#__PURE__*/React.createElement("div", {
      className: "confirm"
    }, /*#__PURE__*/React.createElement("div", {
      className: "confirm-ic"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "heart",
      size: 34,
      color: "var(--eucalyptus)",
      fill: "var(--eucalyptus)"
    })), /*#__PURE__*/React.createElement("h1", {
      className: "h-lg"
    }, "Thank you"), /*#__PURE__*/React.createElement("p", {
      className: "muted",
      style: {
        margin: 0
      }
    }, "Your review helps other island guests find great studios."))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "12px 18px calc(12px + env(safe-area-inset-bottom,0px))"
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn--primary btn--full",
      onClick: nav.pop
    }, "Done")));
    return /*#__PURE__*/React.createElement("div", {
      className: "sheet-full"
    }, /*#__PURE__*/React.createElement(TopBar, {
      title: "Leave a review",
      onBack: nav.pop
    }), /*#__PURE__*/React.createElement("div", {
      className: "app-scroll"
    }, /*#__PURE__*/React.createElement("div", {
      className: "screen",
      style: {
        paddingTop: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "bk",
      style: {
        cursor: "default"
      }
    }, /*#__PURE__*/React.createElement("img", {
      className: "bk-photo",
      src: booking.photo,
      alt: ""
    }), /*#__PURE__*/React.createElement("div", {
      className: "bk-info"
    }, /*#__PURE__*/React.createElement("div", {
      className: "bk-name"
    }, booking.service), /*#__PURE__*/React.createElement("div", {
      className: "bk-sub"
    }, booking.studio, " \xB7 ", booking.when))), /*#__PURE__*/React.createElement("div", {
      className: "starrow"
    }, [1, 2, 3, 4, 5].map(n => /*#__PURE__*/React.createElement("button", {
      key: n,
      className: n <= r ? "is-on" : "",
      onClick: () => setR(n),
      "aria-label": n + " stars"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "star",
      size: 34,
      fill: n <= r ? "var(--clay)" : "none",
      color: n <= r ? "var(--clay)" : "var(--line-strong)"
    })))), /*#__PURE__*/React.createElement("textarea", {
      className: "reviewtext",
      placeholder: "Tell others about your visit (optional)\u2026",
      value: txt,
      onChange: e => setTxt(e.target.value)
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "12px 18px calc(12px + env(safe-area-inset-bottom,0px))"
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn--primary btn--full",
      onClick: () => {
        onSubmit(booking.id);
        setDone(true);
      }
    }, "Submit review")));
  }

  // ---------- INVITE A STUDIO -> WALLET ----------
  function Invite({
    nav
  }) {
    const [copied, setCopied] = useState(false);
    return /*#__PURE__*/React.createElement("div", {
      className: "sheet-full"
    }, /*#__PURE__*/React.createElement(TopBar, {
      title: "Invite a studio",
      onBack: nav.pop
    }), /*#__PURE__*/React.createElement("div", {
      className: "app-scroll"
    }, /*#__PURE__*/React.createElement("div", {
      className: "screen",
      style: {
        paddingTop: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "wallet"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tiny",
      style: {
        opacity: 0.8
      }
    }, "Your wallet"), /*#__PURE__*/React.createElement("div", {
      className: "wallet-amt"
    }, "\u20AC15"), /*#__PURE__*/React.createElement("div", {
      className: "tiny",
      style: {
        opacity: 0.8
      }
    }, "Credit toward any booking")), /*#__PURE__*/React.createElement("div", {
      className: "block--flush"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "h-md"
    }, "Know a great studio?"), /*#__PURE__*/React.createElement("p", {
      className: "muted",
      style: {
        marginTop: 6
      }
    }, "Invite a salon, spa or barber to join sey.la | book. When they go live, you both get ", /*#__PURE__*/React.createElement("b", {
      style: {
        color: "var(--ink)"
      }
    }, "\u20AC15"), " in credit.")), /*#__PURE__*/React.createElement("div", {
      className: "block--flush"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tiny muted",
      style: {
        marginBottom: 8,
        fontWeight: 600
      }
    }, "Your invite code"), /*#__PURE__*/React.createElement("div", {
      className: "invite-code"
    }, "AMELIA-15", /*#__PURE__*/React.createElement("button", {
      className: "btn btn--sm btn--soft",
      onClick: () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    }, copied ? "Copied ✓" : "Copy"))))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "12px 18px calc(12px + env(safe-area-inset-bottom,0px))"
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn--primary btn--full"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "share",
      size: 18,
      color: "var(--cream)"
    }), " Share invite")));
  }

  // ---------- BOOKING ACTION SHEET (cancel / reschedule) ----------
  function BookingActions({
    booking,
    onClose,
    onCancel,
    onReschedule,
    onViewStudio
  }) {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "sheet-scrim",
      onClick: onClose
    }), /*#__PURE__*/React.createElement("div", {
      className: "sheet actionsheet"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sheet-grab"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "0 4px 8px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "bk-when"
    }, booking.when), /*#__PURE__*/React.createElement("div", {
      className: "bk-name"
    }, booking.service), /*#__PURE__*/React.createElement("div", {
      className: "bk-sub muted"
    }, booking.studio)), /*#__PURE__*/React.createElement("button", {
      className: "act",
      onClick: onReschedule
    }, /*#__PURE__*/React.createElement("span", {
      className: "act-ic"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "calendar",
      size: 20
    })), "Reschedule"), /*#__PURE__*/React.createElement("button", {
      className: "act",
      onClick: onViewStudio
    }, /*#__PURE__*/React.createElement("span", {
      className: "act-ic"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "pin",
      size: 20
    })), "View studio"), /*#__PURE__*/React.createElement("button", {
      className: "act danger",
      onClick: onCancel
    }, /*#__PURE__*/React.createElement("span", {
      className: "act-ic",
      style: {
        background: "var(--blush)"
      }
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "close",
      size: 19,
      color: "var(--clay)"
    })), "Cancel booking"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn--soft btn--full",
      style: {
        marginTop: 12
      },
      onClick: onClose
    }, "Keep booking")));
  }

  // ---------- WAITLIST ----------
  function Waitlist({
    nav
  }) {
    const [items, setItems] = useState([{
      id: "w1",
      studio: "L'Accent Barber",
      studioId: "laccent",
      slot: "Today · 16:00",
      svc: "Skin fade & beard",
      photo: D.STUDIOS.find(s => s.id === "laccent").photo,
      on: true
    }, {
      id: "w2",
      studio: "Kreol Spa",
      studioId: "kreol-spa",
      slot: "Sat · morning",
      svc: "Coconut & frangipani massage",
      photo: D.STUDIOS.find(s => s.id === "kreol-spa").photo,
      on: true
    }]);
    return /*#__PURE__*/React.createElement("div", {
      className: "sheet-full"
    }, /*#__PURE__*/React.createElement(TopBar, {
      title: "Waitlist",
      onBack: nav.pop
    }), /*#__PURE__*/React.createElement("div", {
      className: "app-scroll"
    }, /*#__PURE__*/React.createElement("div", {
      className: "screen",
      style: {
        paddingTop: 6
      }
    }, /*#__PURE__*/React.createElement("p", {
      className: "muted",
      style: {
        margin: "0 0 12px"
      }
    }, "We'll notify you the moment a slot frees up. Booking still free \u2014 first to tap gets it."), items.length === 0 ? /*#__PURE__*/React.createElement("div", {
      className: "empty"
    }, /*#__PURE__*/React.createElement("div", {
      className: "empty-ic"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "clock",
      size: 26
    })), /*#__PURE__*/React.createElement("div", {
      className: "h-md"
    }, "No waitlists"), /*#__PURE__*/React.createElement("p", {
      className: "muted",
      style: {
        margin: 0
      }
    }, "Tap \"Join waitlist\" on a full time slot.")) : items.map(w => /*#__PURE__*/React.createElement("div", {
      className: "bk",
      key: w.id,
      style: {
        cursor: "default",
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("img", {
      className: "bk-photo",
      src: w.photo,
      alt: ""
    }), /*#__PURE__*/React.createElement("div", {
      className: "bk-info"
    }, /*#__PURE__*/React.createElement("div", {
      className: "bk-when"
    }, w.slot), /*#__PURE__*/React.createElement("div", {
      className: "bk-name"
    }, w.svc), /*#__PURE__*/React.createElement("div", {
      className: "bk-sub"
    }, w.studio)), /*#__PURE__*/React.createElement("span", {
      className: "switch" + (w.on ? " is-on" : ""),
      onClick: () => setItems(items.map(x => x.id === w.id ? {
        ...x,
        on: !x.on
      } : x))
    }, /*#__PURE__*/React.createElement("i", null)))))));
  }

  // ---------- PACKAGES & GIFT CARDS ----------
  function Packages({
    nav
  }) {
    const owned = [{
      id: "p1",
      name: "5× Coconut massage",
      studio: "Kreol Spa",
      left: 2,
      total: 5,
      exp: "Exp. Dec 2026"
    }, {
      id: "p2",
      name: "Unlimited yoga · monthly",
      studio: "North Shore Fitness",
      left: "∞",
      total: "∞",
      exp: "Renews 1 Aug"
    }];
    return /*#__PURE__*/React.createElement("div", {
      className: "sheet-full"
    }, /*#__PURE__*/React.createElement(TopBar, {
      title: "Packages & gift cards",
      onBack: nav.pop
    }), /*#__PURE__*/React.createElement("div", {
      className: "app-scroll"
    }, /*#__PURE__*/React.createElement("div", {
      className: "screen",
      style: {
        paddingTop: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "wallet"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tiny",
      style: {
        opacity: 0.8
      }
    }, "Gift card balance"), /*#__PURE__*/React.createElement("div", {
      className: "wallet-amt"
    }, "\u20AC40"), /*#__PURE__*/React.createElement("div", {
      className: "tiny",
      style: {
        opacity: 0.8
      }
    }, "Use at any sey.la studio")), /*#__PURE__*/React.createElement("div", {
      className: "sec-title",
      style: {
        marginTop: 22
      }
    }, /*#__PURE__*/React.createElement("h2", {
      className: "h-md"
    }, "Your packages")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 12
      }
    }, owned.map(p => /*#__PURE__*/React.createElement("div", {
      className: "loy",
      key: p.id
    }, /*#__PURE__*/React.createElement("div", {
      className: "loy-head"
    }, /*#__PURE__*/React.createElement("span", {
      className: "staff-any"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "sparkle",
      size: 20
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "scard-name"
    }, p.name), /*#__PURE__*/React.createElement("div", {
      className: "loy-progress"
    }, p.studio, " \xB7 ", p.exp)), /*#__PURE__*/React.createElement("span", {
      className: "tagpill loyal"
    }, p.left, " left"))))), /*#__PURE__*/React.createElement("div", {
      className: "block"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sec-title"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "h-md"
    }, "Buy")), /*#__PURE__*/React.createElement("button", {
      className: "paymethod",
      onClick: () => nav.push("giftbuy")
    }, /*#__PURE__*/React.createElement("span", {
      className: "arow-ic"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "heart",
      size: 19
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "srv-name"
    }, "Send a gift card"), /*#__PURE__*/React.createElement("div", {
      className: "srv-meta"
    }, "\u20AC25 \xB7 \u20AC50 \xB7 \u20AC100")), /*#__PURE__*/React.createElement(Ic, {
      name: "chevronRight",
      size: 18,
      color: "var(--cocoa-40)"
    })), /*#__PURE__*/React.createElement("button", {
      className: "paymethod",
      onClick: () => nav.push("studio", {
        id: "kreol-spa"
      })
    }, /*#__PURE__*/React.createElement("span", {
      className: "arow-ic"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "sparkle",
      size: 19
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "srv-name"
    }, "Buy a service package"), /*#__PURE__*/React.createElement("div", {
      className: "srv-meta"
    }, "Save up to 20% vs single visits")), /*#__PURE__*/React.createElement(Ic, {
      name: "chevronRight",
      size: 18,
      color: "var(--cocoa-40)"
    }))))));
  }
  function GiftBuy({
    nav
  }) {
    const [amt, setAmt] = useState(50);
    const [done, setDone] = useState(false);
    if (done) return /*#__PURE__*/React.createElement("div", {
      className: "sheet-full"
    }, /*#__PURE__*/React.createElement("div", {
      className: "app-scroll"
    }, /*#__PURE__*/React.createElement("div", {
      className: "confirm"
    }, /*#__PURE__*/React.createElement("div", {
      className: "confirm-ic"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "heart",
      size: 34,
      color: "var(--eucalyptus)",
      fill: "var(--eucalyptus)"
    })), /*#__PURE__*/React.createElement("h1", {
      className: "h-lg"
    }, "Gift on its way"), /*#__PURE__*/React.createElement("p", {
      className: "muted",
      style: {
        margin: 0
      }
    }, "A \u20AC", amt, " sey.la gift card has been sent."))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "12px 18px calc(12px + env(safe-area-inset-bottom,0px))"
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn--primary btn--full",
      onClick: nav.pop
    }, "Done")));
    return /*#__PURE__*/React.createElement("div", {
      className: "sheet-full"
    }, /*#__PURE__*/React.createElement(TopBar, {
      title: "Send a gift card",
      onBack: nav.pop
    }), /*#__PURE__*/React.createElement("div", {
      className: "app-scroll"
    }, /*#__PURE__*/React.createElement("div", {
      className: "screen",
      style: {
        paddingTop: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "eyebrow",
      style: {
        marginBottom: 10
      }
    }, "Amount"), /*#__PURE__*/React.createElement("div", {
      className: "slotgrid",
      style: {
        gridTemplateColumns: "repeat(3,1fr)"
      }
    }, [25, 50, 100].map(v => /*#__PURE__*/React.createElement("button", {
      key: v,
      className: "slot" + (amt === v ? " is-active" : ""),
      onClick: () => setAmt(v)
    }, "\u20AC", v))), /*#__PURE__*/React.createElement("div", {
      className: "field",
      style: {
        marginTop: 16
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "field-prefix"
    }, "To"), /*#__PURE__*/React.createElement("input", {
      placeholder: "Recipient's phone or email"
    })), /*#__PURE__*/React.createElement("div", {
      className: "field",
      style: {
        marginTop: 10
      }
    }, /*#__PURE__*/React.createElement("input", {
      placeholder: "Message (optional)"
    })))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "12px 18px calc(12px + env(safe-area-inset-bottom,0px))"
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn--primary btn--full",
      onClick: () => setDone(true)
    }, "Pay \u20AC", amt, " & send")));
  }

  // ---------- MESSAGES ----------
  function Messages({
    nav
  }) {
    const threads = [{
      id: "kreol-spa",
      studio: "Kreol Spa",
      photo: D.STUDIOS.find(s => s.id === "kreol-spa").photo,
      last: "See you tomorrow at 14:30 🌺",
      when: "2h",
      unread: true
    }, {
      id: "laccent",
      studio: "L'Accent Barber",
      photo: D.STUDIOS.find(s => s.id === "laccent").photo,
      last: "A slot opened at 16:00 today",
      when: "1d",
      unread: false
    }];
    return /*#__PURE__*/React.createElement("div", {
      className: "sheet-full"
    }, /*#__PURE__*/React.createElement(TopBar, {
      title: "Messages",
      onBack: nav.pop
    }), /*#__PURE__*/React.createElement("div", {
      className: "app-scroll"
    }, /*#__PURE__*/React.createElement("div", {
      className: "screen",
      style: {
        paddingTop: 4
      }
    }, threads.map(t => /*#__PURE__*/React.createElement("div", {
      className: "arow",
      key: t.id,
      onClick: () => nav.push("thread", {
        id: t.id
      })
    }, /*#__PURE__*/React.createElement("img", {
      className: "avatar",
      style: {
        width: 46,
        height: 46
      },
      src: t.photo,
      alt: ""
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "appt-name"
    }, t.studio), /*#__PURE__*/React.createElement("div", {
      className: "srv-meta",
      style: {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }
    }, t.last)), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "right"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "tiny muted"
    }, t.when), t.unread && /*#__PURE__*/React.createElement("span", {
      className: "dotsep",
      style: {
        width: 8,
        height: 8,
        background: "var(--clay)",
        marginTop: 4
      }
    })))))));
  }
  function Thread({
    id,
    nav
  }) {
    const st = D.STUDIOS.find(s => s.id === id);
    const [msgs, setMsgs] = useState([{
      me: false,
      t: "Hi Amelia! Confirming your massage tomorrow at 14:30 with Aline 🌺"
    }, {
      me: true,
      t: "Perfect, thank you! Any parking nearby?"
    }, {
      me: false,
      t: "Yes — free spots right by the beach entrance."
    }]);
    const [txt, setTxt] = useState("");
    function send() {
      if (!txt.trim()) return;
      setMsgs([...msgs, {
        me: true,
        t: txt
      }]);
      setTxt("");
    }
    return /*#__PURE__*/React.createElement("div", {
      className: "sheet-full"
    }, /*#__PURE__*/React.createElement(TopBar, {
      title: st.name,
      onBack: nav.pop
    }), /*#__PURE__*/React.createElement("div", {
      className: "app-scroll",
      style: {
        paddingBottom: 76
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "screen",
      style: {
        paddingTop: 10,
        display: "flex",
        flexDirection: "column",
        gap: 8
      }
    }, msgs.map((m, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "msgbubble" + (m.me ? " me" : "")
    }, m.t)))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        padding: "10px 14px calc(10px + env(safe-area-inset-bottom,0px))",
        background: "var(--surface)",
        borderTop: "1px solid var(--line)",
        display: "flex",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("input", {
      className: "field",
      style: {
        flex: 1,
        height: 46
      },
      value: txt,
      onChange: e => setTxt(e.target.value),
      placeholder: "Message\u2026",
      onKeyDown: e => {
        if (e.key === "Enter") send();
      }
    }), /*#__PURE__*/React.createElement("button", {
      className: "iconbtn",
      style: {
        width: 46,
        height: 46,
        background: "var(--ink)",
        color: "var(--cream)",
        border: "none"
      },
      onClick: send
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "arrowRight",
      size: 20,
      color: "var(--cream)"
    }))));
  }

  // ---------- TAB BAR ----------
  function TabBar({
    tab,
    setTab,
    upcoming
  }) {
    const tabs = [{
      id: "home",
      ic: "home",
      lb: "Home"
    }, {
      id: "search",
      ic: "search",
      lb: "Search"
    }, {
      id: "bookings",
      ic: "calendar",
      lb: "Bookings"
    }, {
      id: "account",
      ic: "user",
      lb: "Account"
    }];
    return /*#__PURE__*/React.createElement("nav", {
      className: "tabbar"
    }, tabs.map(t => /*#__PURE__*/React.createElement("button", {
      key: t.id,
      className: "tab" + (tab === t.id ? " is-active" : ""),
      onClick: () => setTab(t.id)
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: "relative"
      }
    }, /*#__PURE__*/React.createElement(Ic, {
      name: t.ic,
      size: 24,
      sw: tab === t.id ? 2.1 : 1.75
    }), t.id === "bookings" && upcoming > 0 && /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        top: -3,
        right: -8,
        minWidth: 16,
        height: 16,
        padding: "0 4px",
        borderRadius: 999,
        background: "var(--clay)",
        color: "#fff",
        fontSize: 10,
        fontWeight: 700,
        display: "grid",
        placeItems: "center"
      }
    }, upcoming)), /*#__PURE__*/React.createElement("span", {
      className: "tab-lb"
    }, t.lb))));
  }

  // ---------- ROOT ----------
  function App() {
    const [tab, setTab] = useState("home");
    const [stack, setStack] = useState([]); // overlay pages on top of the active tab
    const [favs, setFavs] = useState(() => load("favs", ["kreol-spa"]));
    const [bookings, setBookings] = useState(() => load("bookings", D.BOOKINGS));
    const [joined, setJoined] = useState(() => load("joined", []));
    const [reviewed, setReviewed] = useState(() => load("reviewed", []));
    const [manage, setManage] = useState(null); // booking being managed (action sheet)
    const [showSplash, setShowSplash] = useState(true);
    const [user, setUser] = useState(() => load("user", null));
    const [notif, setNotif] = useState(() => load("notif", true));
    const [toast, setToast] = useState(null);
    const [install, setInstall] = useState(false);
    useEffect(() => save("favs", favs), [favs]);
    useEffect(() => save("bookings", bookings), [bookings]);
    useEffect(() => save("joined", joined), [joined]);
    useEffect(() => save("reviewed", reviewed), [reviewed]);
    useEffect(() => save("user", user), [user]);
    useEffect(() => save("notif", notif), [notif]);
    useEffect(() => {
      const t = setTimeout(() => setInstall(true), 2600);
      return () => clearTimeout(t);
    }, []);
    const showToast = m => {
      setToast(m);
      setTimeout(() => setToast(null), 1800);
    };
    const nav = {
      push: (name, props) => setStack(s => [...s, {
        name,
        props: props || {}
      }]),
      pop: () => setStack(s => s.slice(0, -1)),
      reset: toTab => {
        setStack([]);
        if (toTab) setTab(toTab);
      }
    };
    const toggleFav = id => setFavs(f => {
      const on = f.includes(id);
      showToast(on ? "Removed from favourites" : "Saved to favourites");
      return on ? f.filter(x => x !== id) : [...f, id];
    });
    const addBooking = b => setBookings(v => [b, ...v]);
    const cancelBooking = id => {
      setBookings(v => v.filter(b => b.id !== id));
      setManage(null);
      showToast("Booking cancelled");
    };
    const joinClass = c => {
      setJoined(j => [...j, c.id]);
      addBooking({
        id: "bk" + Date.now(),
        studioId: c.studioId,
        studio: c.studio,
        area: "",
        service: c.name + " · class",
        when: c.day + " · " + c.time,
        price: c.price,
        status: "Confirmed",
        photo: D.STUDIOS.find(s => s.id === c.studioId).photo,
        past: false
      });
      showToast("You joined the class");
    };
    const switchTab = t => {
      setStack([]);
      setTab(t);
    };
    const upcoming = bookings.filter(b => !b.past).length;

    // active tab screen
    let base;
    if (tab === "home") base = /*#__PURE__*/React.createElement(Home, {
      nav: nav,
      favs: favs,
      toggleFav: toggleFav,
      setTab: switchTab,
      notif: notif
    });else if (tab === "search") base = /*#__PURE__*/React.createElement(Search, {
      nav: nav,
      favs: favs,
      toggleFav: toggleFav
    });else if (tab === "bookings") base = /*#__PURE__*/React.createElement(Bookings, {
      bookings: bookings,
      nav: nav,
      onManage: setManage,
      reviewed: reviewed
    });else base = /*#__PURE__*/React.createElement(Account, {
      user: user,
      setUser: setUser,
      favs: favs,
      nav: nav,
      notif: notif,
      setNotif: setNotif
    });

    // top overlay
    const top = stack[stack.length - 1];
    let overlay = null;
    if (top) {
      const p = top.props;
      if (top.name === "studio") overlay = /*#__PURE__*/React.createElement(Studio, {
        id: p.id,
        nav: nav,
        favs: favs,
        toggleFav: toggleFav
      });else if (top.name === "search") overlay = /*#__PURE__*/React.createElement("div", {
        className: "sheet-full"
      }, /*#__PURE__*/React.createElement(TopBar, {
        title: "Browse",
        onBack: nav.pop
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }
      }, /*#__PURE__*/React.createElement(Search, {
        nav: nav,
        favs: favs,
        toggleFav: toggleFav,
        initialCat: p.cat
      })));else if (top.name === "book") overlay = /*#__PURE__*/React.createElement(BookFlow, {
        id: p.id,
        serviceId: p.serviceId,
        nav: nav,
        addBooking: addBooking
      });else if (top.name === "classJoin") overlay = /*#__PURE__*/React.createElement(ClassJoin, {
        id: p.id,
        nav: nav,
        joinClass: joinClass,
        joinedIds: joined
      });else if (top.name === "classes") overlay = /*#__PURE__*/React.createElement(Classes, {
        nav: nav
      });else if (top.name === "favs") overlay = /*#__PURE__*/React.createElement(Favourites, {
        favs: favs,
        toggleFav: toggleFav,
        nav: nav
      });else if (top.name === "notif") overlay = /*#__PURE__*/React.createElement(Notifications, {
        nav: nav
      });else if (top.name === "rewards") overlay = /*#__PURE__*/React.createElement(Rewards, {
        nav: nav
      });else if (top.name === "invite") overlay = /*#__PURE__*/React.createElement(Invite, {
        nav: nav
      });else if (top.name === "review") {
        const bk = bookings.find(b => b.id === p.bookingId);
        overlay = /*#__PURE__*/React.createElement(ReviewFlow, {
          booking: bk,
          nav: nav,
          onSubmit: id => setReviewed(r => [...r, id])
        });
      } else if (top.name === "waitlist") overlay = /*#__PURE__*/React.createElement(Waitlist, {
        nav: nav
      });else if (top.name === "packages") overlay = /*#__PURE__*/React.createElement(Packages, {
        nav: nav
      });else if (top.name === "giftbuy") overlay = /*#__PURE__*/React.createElement(GiftBuy, {
        nav: nav
      });else if (top.name === "messages") overlay = /*#__PURE__*/React.createElement(Messages, {
        nav: nav
      });else if (top.name === "thread") overlay = /*#__PURE__*/React.createElement(Thread, {
        id: p.id,
        nav: nav
      });
    }
    return /*#__PURE__*/React.createElement("div", {
      className: "app"
    }, showSplash && /*#__PURE__*/React.createElement("div", {
      className: "splash",
      onAnimationEnd: () => setShowSplash(false)
    }, /*#__PURE__*/React.createElement("div", {
      className: "brand",
      style: {
        fontSize: "1.7rem"
      }
    }, /*#__PURE__*/React.createElement("b", null, "sey.la"), /*#__PURE__*/React.createElement("span", null, "|"), /*#__PURE__*/React.createElement("i", null, "book")), /*#__PURE__*/React.createElement("div", {
      className: "tiny",
      style: {
        opacity: 0.7
      }
    }, "Book your island ritual")), base, overlay, !top && /*#__PURE__*/React.createElement(TabBar, {
      tab: tab,
      setTab: switchTab,
      upcoming: upcoming
    }), toast && /*#__PURE__*/React.createElement("div", {
      className: "toast"
    }, toast), manage && /*#__PURE__*/React.createElement(BookingActions, {
      booking: manage,
      onClose: () => setManage(null),
      onCancel: () => cancelBooking(manage.id),
      onViewStudio: () => {
        const m = manage;
        setManage(null);
        nav.push("studio", {
          id: m.studioId
        });
      },
      onReschedule: () => {
        const m = manage;
        setManage(null);
        nav.push("book", {
          id: m.studioId
        });
        showToast("Pick a new time");
      }
    }), install && !top && /*#__PURE__*/React.createElement("div", {
      className: "install"
    }, /*#__PURE__*/React.createElement("span", {
      className: "arow-ic",
      style: {
        background: "rgba(255,255,255,0.14)",
        color: "var(--cream)"
      }
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "home",
      size: 20,
      color: "var(--cream)"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 700
      }
    }, "Install sey.la | book"), /*#__PURE__*/React.createElement("div", {
      className: "tiny",
      style: {
        opacity: 0.8
      }
    }, "Add to home screen \xB7 works offline")), /*#__PURE__*/React.createElement("button", {
      className: "btn btn--sm",
      onClick: () => {
        setInstall(false);
        showToast("Look for 'Add to Home Screen'");
      }
    }, "Add"), /*#__PURE__*/React.createElement("button", {
      className: "iconbtn iconbtn--plain",
      style: {
        width: 32,
        height: 32,
        color: "var(--cream)"
      },
      onClick: () => setInstall(false),
      "aria-label": "Dismiss"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "close",
      size: 18,
      color: "var(--cream)"
    }))));
  }
  ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile/data.js
try { (() => {
// sey.la | book PWA — mock data. Exposed on window for the Babel app scripts.
(function () {
  const U = "https://images.unsplash.com/photo-";
  const q = "?auto=format&fit=crop&w=600&q=70";
  const CATEGORIES = [{
    id: "hair",
    label: "Hair",
    icon: "hair"
  }, {
    id: "nails",
    label: "Nails",
    icon: "nails"
  }, {
    id: "spa",
    label: "Spa & massage",
    icon: "spa"
  }, {
    id: "barber",
    label: "Barber",
    icon: "barber"
  }, {
    id: "brows",
    label: "Brows & lashes",
    icon: "brows"
  }, {
    id: "makeup",
    label: "Makeup",
    icon: "makeup"
  }, {
    id: "skin",
    label: "Facials",
    icon: "skin"
  }, {
    id: "waxing",
    label: "Waxing",
    icon: "waxing"
  }, {
    id: "tattoo",
    label: "Tattoo",
    icon: "tattoo"
  }, {
    id: "piercing",
    label: "Piercing",
    icon: "piercing"
  }, {
    id: "fitness",
    label: "Fitness & yoga",
    icon: "fitness"
  }, {
    id: "trainer",
    label: "Personal training",
    icon: "trainer"
  }];
  const STUDIOS = [{
    id: "kreol-spa",
    name: "Kreol Spa",
    cat: "spa",
    area: "Beau Vallon, Mahé",
    rating: 4.9,
    reviews: 328,
    distance: "1.2 km",
    price: "€€",
    tag: "Verified",
    photo: U + "1600334129128-685c5582fd35" + q,
    x: 34,
    y: 40,
    about: "An island spa on Beau Vallon beach — Creole rituals with coconut, frangipani and volcanic clay.",
    hours: [["Mon", "9:00 – 19:00"], ["Tue", "9:00 – 19:00"], ["Wed", "9:00 – 19:00"], ["Thu", "9:00 – 20:00"], ["Fri", "9:00 – 20:00"], ["Sat", "8:00 – 20:00"], ["Sun", "10:00 – 16:00"]],
    todayIdx: 3,
    gallery: [U + "1544161515-4ab6ce6db874" + q, U + "1519823551278-64ac92734fb1" + q, U + "1596178065887-1198b6148b2b" + q, U + "1540555700478-4be289fbecef" + q, U + "1571019613454-1cb2f99b2d8b" + q, U + "1560750588-73207b1ef5b8" + q],
    services: [{
      g: "Massage",
      items: [{
        id: "s1",
        name: "Coconut & frangipani massage",
        dur: "60 min",
        price: 55
      }, {
        id: "s2",
        name: "Hot stone therapy",
        dur: "75 min",
        price: 65
      }, {
        id: "s3",
        name: "Deep tissue",
        dur: "60 min",
        price: 58
      }]
    }, {
      g: "Face",
      items: [{
        id: "s4",
        name: "Signature Creole facial",
        dur: "50 min",
        price: 48
      }, {
        id: "s5",
        name: "Express glow facial",
        dur: "30 min",
        price: 32
      }]
    }]
  }, {
    id: "north-shore-fit",
    name: "North Shore Fitness",
    cat: "trainer",
    area: "Glacis, Mahé",
    rating: 4.8,
    reviews: 141,
    distance: "3.4 km",
    price: "€€",
    tag: "Classes",
    photo: U + "1571902943202-507ec2618e8f" + q,
    x: 60,
    y: 22,
    about: "Small-group training and sunrise beach yoga above the north coast.",
    hours: [["Mon", "6:00 – 20:00"], ["Tue", "6:00 – 20:00"], ["Wed", "6:00 – 20:00"], ["Thu", "6:00 – 20:00"], ["Fri", "6:00 – 20:00"], ["Sat", "7:00 – 13:00"], ["Sun", "Closed"]],
    todayIdx: 3,
    gallery: [U + "1534438327276-14e5300c3a48" + q, U + "1518611012118-696072aa579a" + q, U + "1506126613408-eca07ce68773" + q],
    services: [{
      g: "Training",
      items: [{
        id: "t1",
        name: "Personal training · 1:1",
        dur: "45 min",
        price: 40
      }, {
        id: "t2",
        name: "Small-group strength",
        dur: "45 min",
        price: 25
      }]
    }]
  }, {
    id: "laccent",
    name: "L'Accent Barber",
    cat: "barber",
    area: "Victoria, Mahé",
    rating: 4.9,
    reviews: 512,
    distance: "0.6 km",
    price: "€",
    tag: "Popular",
    photo: U + "1503951914875-452162b0f3f1" + q,
    x: 46,
    y: 58,
    about: "Classic hot-towel barbering in the heart of Victoria.",
    hours: [["Mon", "9:00 – 18:00"], ["Tue", "9:00 – 18:00"], ["Wed", "9:00 – 18:00"], ["Thu", "9:00 – 19:00"], ["Fri", "9:00 – 19:00"], ["Sat", "8:00 – 17:00"], ["Sun", "Closed"]],
    todayIdx: 3,
    gallery: [U + "1585747860715-2ba37e788b70" + q, U + "1512864084360-7c0c4d0a0845" + q, U + "1599351431202-1e0f0137899a" + q],
    services: [{
      g: "Barber",
      items: [{
        id: "b1",
        name: "Skin fade & beard",
        dur: "45 min",
        price: 28
      }, {
        id: "b2",
        name: "Classic cut",
        dur: "30 min",
        price: 20
      }, {
        id: "b3",
        name: "Hot-towel shave",
        dur: "30 min",
        price: 22
      }]
    }]
  }, {
    id: "lumiere-nails",
    name: "Lumière Nails",
    cat: "nails",
    area: "Eden Island, Mahé",
    rating: 4.7,
    reviews: 203,
    distance: "2.1 km",
    price: "€€",
    tag: "Verified",
    photo: U + "1610992015732-2449b76344bc" + q,
    x: 72,
    y: 66,
    about: "Gel, BIAB and nail art by the Eden marina.",
    hours: [["Mon", "9:00 – 18:00"], ["Tue", "9:00 – 18:00"], ["Wed", "9:00 – 18:00"], ["Thu", "9:00 – 18:00"], ["Fri", "9:00 – 19:00"], ["Sat", "9:00 – 18:00"], ["Sun", "10:00 – 15:00"]],
    todayIdx: 3,
    gallery: [U + "1604654894610-df63bc536371" + q, U + "1632345031435-8727f6897d53" + q, U + "1519014816548-bf5fe059798b" + q],
    services: [{
      g: "Nails",
      items: [{
        id: "n1",
        name: "Gel manicure",
        dur: "45 min",
        price: 30
      }, {
        id: "n2",
        name: "BIAB overlay",
        dur: "60 min",
        price: 42
      }, {
        id: "n3",
        name: "Pedicure spa",
        dur: "50 min",
        price: 38
      }]
    }]
  }, {
    id: "island-glow",
    name: "Island Glow Studio",
    cat: "skin",
    area: "Beau Vallon, Mahé",
    rating: 4.8,
    reviews: 176,
    distance: "1.4 km",
    price: "€€€",
    tag: "New",
    photo: U + "1570172619644-dfd03ed5d881" + q,
    x: 30,
    y: 30,
    about: "Results-driven facials and skin therapy.",
    hours: [["Mon", "10:00 – 19:00"], ["Tue", "10:00 – 19:00"], ["Wed", "10:00 – 19:00"], ["Thu", "10:00 – 19:00"], ["Fri", "10:00 – 19:00"], ["Sat", "9:00 – 17:00"], ["Sun", "Closed"]],
    todayIdx: 3,
    gallery: [U + "1512290923902-8a9f81dc236c" + q, U + "1596755389378-c31d21fd1273" + q, U + "1607779097040-26e80aa78e66" + q],
    services: [{
      g: "Face",
      items: [{
        id: "f1",
        name: "Hydrafacial",
        dur: "60 min",
        price: 78
      }, {
        id: "f2",
        name: "LED & peel",
        dur: "45 min",
        price: 62
      }]
    }]
  }];
  const CLASSES = [{
    id: "c1",
    studio: "North Shore Fitness",
    studioId: "north-shore-fit",
    name: "Sunrise beach yoga",
    instructor: "with Aline",
    day: "Sat",
    time: "07:00",
    dur: "60 min",
    level: "All levels",
    price: 18,
    spots: 6,
    cap: 14
  }, {
    id: "c2",
    studio: "North Shore Fitness",
    studioId: "north-shore-fit",
    name: "Small-group strength",
    instructor: "with Denis",
    day: "Sat",
    time: "08:30",
    dur: "45 min",
    level: "Intermediate",
    price: 25,
    spots: 2,
    cap: 6
  }, {
    id: "c3",
    studio: "Kreol Spa",
    studioId: "kreol-spa",
    name: "Sound bath & breathwork",
    instructor: "with Maya",
    day: "Sun",
    time: "17:00",
    dur: "50 min",
    level: "All levels",
    price: 22,
    spots: 9,
    cap: 16
  }, {
    id: "c4",
    studio: "North Shore Fitness",
    studioId: "north-shore-fit",
    name: "HIIT circuit",
    instructor: "with Denis",
    day: "Mon",
    time: "18:00",
    dur: "40 min",
    level: "Advanced",
    price: 20,
    spots: 4,
    cap: 10
  }];
  const BOOKINGS = [{
    id: "bk1",
    studioId: "kreol-spa",
    studio: "Kreol Spa",
    area: "Beau Vallon, Mahé",
    service: "Coconut & frangipani massage",
    when: "Tomorrow · 14:30",
    price: 55,
    status: "Confirmed",
    photo: U + "1600334129128-685c5582fd35" + q,
    past: false
  }, {
    id: "bk2",
    studioId: "north-shore-fit",
    studio: "North Shore Fitness",
    area: "Glacis, Mahé",
    service: "Sunrise beach yoga · class",
    when: "Sat · 07:00",
    price: 18,
    status: "Confirmed",
    photo: U + "1571902943202-507ec2618e8f" + q,
    past: false
  }, {
    id: "bk3",
    studioId: "laccent",
    studio: "L'Accent Barber",
    area: "Victoria, Mahé",
    service: "Skin fade & beard",
    when: "12 Jun · 10:00",
    price: 28,
    status: "Completed",
    photo: U + "1503951914875-452162b0f3f1" + q,
    past: true
  }, {
    id: "bk4",
    studioId: "lumiere-nails",
    studio: "Lumière Nails",
    area: "Eden Island, Mahé",
    service: "Gel manicure",
    when: "28 May · 16:30",
    price: 30,
    status: "Completed",
    photo: U + "1610992015732-2449b76344bc" + q,
    past: true
  }];
  const REVIEWS = [{
    name: "Sara M.",
    when: "2 weeks ago",
    rating: 5,
    text: "The frangipani massage was unreal — left floating. Booking took ten seconds.",
    av: U + "1544005313-94ddf0286df2" + q
  }, {
    name: "James O.",
    when: "1 month ago",
    rating: 5,
    text: "Real-time slots meant I got in same day. Spotless place, warm team.",
    av: U + "1500648767791-00dcc994a43e" + q
  }, {
    name: "Nadia R.",
    when: "1 month ago",
    rating: 4,
    text: "Lovely treatment. Parking near Beau Vallon can be tricky at weekends.",
    av: U + "1534528741775-53994a69daeb" + q
  }];
  const DAYS = [{
    d: "Today",
    n: "3"
  }, {
    d: "Thu",
    n: "4"
  }, {
    d: "Fri",
    n: "5"
  }, {
    d: "Sat",
    n: "6"
  }, {
    d: "Sun",
    n: "7"
  }, {
    d: "Mon",
    n: "8"
  }, {
    d: "Tue",
    n: "9"
  }, {
    d: "Wed",
    n: "10"
  }];
  const SLOTS = ["09:00", "10:00", "11:00", "12:30", "14:00", "14:30", "16:00", "17:15", "18:00", "18:45", "19:15", "20:00"];
  const TAKEN = ["12:30", "16:00", "19:15"];
  const LOYALTY = [{
    studioId: "kreol-spa",
    studio: "Kreol Spa",
    photo: U + "1600334129128-685c5582fd35" + q,
    have: 4,
    need: 6,
    reward: "6th massage — 50% off"
  }, {
    studioId: "laccent",
    studio: "L'Accent Barber",
    photo: U + "1503951914875-452162b0f3f1" + q,
    have: 9,
    need: 10,
    reward: "10th cut on the house"
  }, {
    studioId: "lumiere-nails",
    studio: "Lumière Nails",
    photo: U + "1610992015732-2449b76344bc" + q,
    have: 2,
    need: 8,
    reward: "Free nail art set"
  }];
  const STAFF = [{
    id: "aline",
    name: "Aline",
    role: "Massage therapist",
    rating: 4.9,
    av: U + "1544005313-94ddf0286df2" + q
  }, {
    id: "denis",
    name: "Denis",
    role: "Barber",
    rating: 4.8,
    av: U + "1500648767791-00dcc994a43e" + q
  }, {
    id: "maya",
    name: "Maya",
    role: "Nail artist",
    rating: 4.9,
    av: U + "1534528741775-53994a69daeb" + q
  }, {
    id: "nadia",
    name: "Nadia",
    role: "Esthetician",
    rating: 4.7,
    av: U + "1531123897727-8f129e1688ce" + q
  }];
  window.SEY_DATA = {
    CATEGORIES,
    STUDIOS,
    CLASSES,
    BOOKINGS,
    REVIEWS,
    DAYS,
    SLOTS,
    TAKEN,
    LOYALTY,
    STAFF
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile/data.js", error: String((e && e.message) || e) }); }

// ui_kits/mobile/service-worker.js
try { (() => {
/* sey.la | book PWA — service worker. Precache the shell + CDN deps for offline. */
const CACHE = "seyla-book-v4";
const ASSETS = ["./index.html", "./app.css", "./App.jsx", "./data.js", "./manifest.webmanifest", "./icon.svg", "../../styles.css", "../../tokens/colors.css", "../../tokens/typography.css", "../../tokens/spacing.css", "../../tokens/effects.css", "../../tokens/base.css", "../../tokens/fonts.css", "../../_ds_bundle.js", "https://unpkg.com/react@18.3.1/umd/react.production.min.js", "https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js", "https://unpkg.com/@babel/standalone@7.29.0/babel.min.js"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS.map(u => new Request(u, {
    cache: "reload"
  })))).catch(() => {}));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

// Cache-first for precached shell; network-first with cache fallback for the rest (e.g. Unsplash).
self.addEventListener("fetch", e => {
  const {
    request
  } = e;
  if (request.method !== "GET") return;
  e.respondWith(caches.match(request).then(cached => {
    if (cached) return cached;
    return fetch(request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(request, copy)).catch(() => {});
      return res;
    }).catch(() => cached);
  }));
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile/service-worker.js", error: String((e && e.message) || e) }); }

// ui_kits/mobile/ui.js
try { (() => {
// sey.la | book PWA — shared UI helpers + local icons. Exposes on window.
(function () {
  const {
    Icon
  } = window.SeyLaBookDesignSystem_611419;
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
    logout: "M14 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2M9 12h11m0 0-3-3m3 3-3 3"
  };
  function Ic({
    name,
    size = 22,
    color = "currentColor",
    fill = "none",
    sw = 1.75,
    style
  }) {
    if (LOCAL[name]) {
      return e("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: color,
        strokeWidth: sw,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        style,
        "aria-hidden": true
      }, e("path", {
        d: LOCAL[name]
      }));
    }
    return e(Icon, {
      name,
      size,
      color,
      fill,
      strokeWidth: sw,
      style
    });
  }
  function Stars({
    r = 5,
    size = 13
  }) {
    return e("span", {
      className: "rating",
      "aria-label": r + " stars"
    }, e(Ic, {
      name: "star",
      size,
      color: "var(--ink)",
      fill: "var(--ink)"
    }));
  }

  // Fade-up wrapper honoring reduced motion is handled by CSS class .fu
  window.SEY_UI = {
    Ic,
    Stars,
    e
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile/ui.js", error: String((e && e.message) || e) }); }

// ui_kits/provider/ProviderPanel.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// ProviderPanel — business panel with a live "Your page" configurator.
(function () {
  const {
    Button,
    Icon,
    Badge,
    BookingCard,
    ClassCard
  } = window.SeyLaBookDesignSystem_611419;
  const U = "https://images.unsplash.com/photo-";
  const NAV = [{
    key: "dashboard",
    label: "Dashboard",
    icon: "sparkle"
  }, {
    key: "calendar",
    label: "Calendar",
    icon: "calendar"
  }, {
    key: "services",
    label: "Services",
    icon: "spa"
  }, {
    key: "classes",
    label: "Classes",
    icon: "fitness"
  }, {
    key: "page",
    label: "Your page",
    icon: "pin"
  }, {
    key: "settings",
    label: "Settings",
    icon: "shield"
  }];

  // Varied aspect ratios on purpose — proves every upload crops cleanly.
  const COVERS = [{
    id: "1696841212541-449ca29397cc",
    label: "Hot stone"
  }, {
    id: "1519823551278-64ac92734fb1",
    label: "Massage"
  }, {
    id: "1600334089648-b0d9d3028eb2",
    label: "Still life"
  }, {
    id: "1620733723572-11c53f73a416",
    label: "Candle"
  }, {
    id: "",
    label: "No photo"
  }];
  const ACCENTS = [{
    name: "Clay",
    val: "var(--clay)"
  }, {
    name: "Eucalyptus",
    val: "var(--eucalyptus)"
  }, {
    name: "Cocoa",
    val: "var(--cocoa)"
  }, {
    name: "Brass",
    val: "var(--brass)"
  }];
  function Preview({
    cfg
  }) {
    const src = cfg.cover ? U + cfg.cover + "?auto=format&fit=crop&w=900&q=72" : null;
    return /*#__PURE__*/React.createElement("div", {
      className: "pv-card"
    }, /*#__PURE__*/React.createElement("div", {
      className: "pv-cover"
    }, src ? /*#__PURE__*/React.createElement("img", {
      src: src,
      alt: ""
    }) : /*#__PURE__*/React.createElement("div", {
      className: "pv-cover-empty"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "spa",
      size: 40,
      color: "rgba(252,248,242,0.9)"
    })), /*#__PURE__*/React.createElement("div", {
      className: "pv-scrim"
    }), /*#__PURE__*/React.createElement("div", {
      className: "pv-cover-body"
    }, /*#__PURE__*/React.createElement("span", {
      className: "pv-cat"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "star",
      size: 13,
      color: "var(--brass)"
    }), " 4.9 \xB7 ", cfg.category), /*#__PURE__*/React.createElement("h3", {
      className: "pv-name"
    }, cfg.name || "Your studio"), /*#__PURE__*/React.createElement("p", {
      className: "pv-tag"
    }, cfg.tagline || "Add a short, calm tagline."), /*#__PURE__*/React.createElement("span", {
      className: "pv-book",
      style: {
        background: cfg.accent
      }
    }, "Book now"))), /*#__PURE__*/React.createElement("div", {
      className: "pv-srv"
    }, cfg.services.map((s, i) => /*#__PURE__*/React.createElement("div", {
      className: "pv-srv-row",
      key: i
    }, /*#__PURE__*/React.createElement("span", null, s.name || "Service"), /*#__PURE__*/React.createElement("b", null, s.price || "€—")))));
  }
  function PageEditor() {
    const [cfg, setCfg] = React.useState({
      name: "Kreol Spa",
      tagline: "A quiet island ritual, a few steps from the sand.",
      category: "Spa & massage",
      cover: "1696841212541-449ca29397cc",
      accent: "var(--clay)",
      services: [{
        name: "Coconut & Frangipani massage",
        price: "€55"
      }, {
        name: "Signature facial",
        price: "€48"
      }, {
        name: "Hot stone therapy",
        price: "€65"
      }]
    });
    const set = (k, v) => setCfg(c => ({
      ...c,
      [k]: v
    }));
    const setSrv = (i, k, v) => setCfg(c => ({
      ...c,
      services: c.services.map((s, j) => j === i ? {
        ...s,
        [k]: v
      } : s)
    }));
    const addSrv = () => setCfg(c => ({
      ...c,
      services: [...c.services, {
        name: "",
        price: ""
      }]
    }));
    const delSrv = i => setCfg(c => ({
      ...c,
      services: c.services.filter((_, j) => j !== i)
    }));
    return /*#__PURE__*/React.createElement("div", {
      className: "pp-page"
    }, /*#__PURE__*/React.createElement("div", {
      className: "pp-editor"
    }, /*#__PURE__*/React.createElement("div", {
      className: "pp-hint"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 16,
      color: "var(--eucalyptus)"
    }), " Whatever photo you upload, we crop, warm-tone and overlay it automatically \u2014 your page always looks polished."), /*#__PURE__*/React.createElement("label", {
      className: "pp-f"
    }, /*#__PURE__*/React.createElement("span", null, "Studio name"), /*#__PURE__*/React.createElement("input", {
      value: cfg.name,
      onChange: e => set("name", e.target.value)
    })), /*#__PURE__*/React.createElement("label", {
      className: "pp-f"
    }, /*#__PURE__*/React.createElement("span", null, "Tagline"), /*#__PURE__*/React.createElement("input", {
      value: cfg.tagline,
      onChange: e => set("tagline", e.target.value)
    })), /*#__PURE__*/React.createElement("label", {
      className: "pp-f"
    }, /*#__PURE__*/React.createElement("span", null, "Category"), /*#__PURE__*/React.createElement("select", {
      value: cfg.category,
      onChange: e => set("category", e.target.value)
    }, ["Spa & massage", "Hair", "Barber", "Nails", "Skin & facial", "Fitness & yoga"].map(c => /*#__PURE__*/React.createElement("option", {
      key: c
    }, c)))), /*#__PURE__*/React.createElement("div", {
      className: "pp-f"
    }, /*#__PURE__*/React.createElement("span", null, "Cover photo"), /*#__PURE__*/React.createElement("div", {
      className: "pp-covers"
    }, COVERS.map(c => /*#__PURE__*/React.createElement("button", {
      key: c.label,
      title: c.label,
      className: "pp-cover-opt" + (cfg.cover === c.id ? " is-active" : "") + (c.id === "" ? " pp-cover-none" : ""),
      onClick: () => set("cover", c.id),
      style: c.id ? {
        backgroundImage: `url(${U + c.id}?auto=format&fit=crop&w=140&q=60)`
      } : undefined
    }, c.id === "" && /*#__PURE__*/React.createElement(Icon, {
      name: "close",
      size: 16,
      color: "var(--cocoa-60)"
    }))))), /*#__PURE__*/React.createElement("div", {
      className: "pp-f"
    }, /*#__PURE__*/React.createElement("span", null, "Accent colour"), /*#__PURE__*/React.createElement("div", {
      className: "pp-swatches"
    }, ACCENTS.map(a => /*#__PURE__*/React.createElement("button", {
      key: a.name,
      title: a.name,
      className: "pp-swatch" + (cfg.accent === a.val ? " is-active" : ""),
      style: {
        background: a.val
      },
      onClick: () => set("accent", a.val)
    })))), /*#__PURE__*/React.createElement("div", {
      className: "pp-f"
    }, /*#__PURE__*/React.createElement("span", null, "Services"), /*#__PURE__*/React.createElement("div", {
      className: "pp-srv-list"
    }, cfg.services.map((s, i) => /*#__PURE__*/React.createElement("div", {
      className: "pp-srv-edit",
      key: i
    }, /*#__PURE__*/React.createElement("input", {
      placeholder: "Service name",
      value: s.name,
      onChange: e => setSrv(i, "name", e.target.value)
    }), /*#__PURE__*/React.createElement("input", {
      placeholder: "\u20AC",
      className: "pp-price",
      value: s.price,
      onChange: e => setSrv(i, "price", e.target.value)
    }), /*#__PURE__*/React.createElement("button", {
      className: "pp-del",
      onClick: () => delSrv(i),
      "aria-label": "Remove"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "close",
      size: 15,
      color: "var(--cocoa-60)"
    })))), /*#__PURE__*/React.createElement("button", {
      className: "pp-add",
      onClick: addSrv
    }, "+ Add service"))), /*#__PURE__*/React.createElement("div", {
      className: "pp-actions"
    }, /*#__PURE__*/React.createElement(Button, {
      as: "a",
      href: "/search"
    }, "Preview full page \u2197"), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary"
    }, "Save & publish"))), /*#__PURE__*/React.createElement("div", {
      className: "pp-preview"
    }, /*#__PURE__*/React.createElement("div", {
      className: "pp-preview-head"
    }, "Live preview"), /*#__PURE__*/React.createElement(Preview, {
      cfg: cfg
    })));
  }
  function Dashboard() {
    const stats = [{
      n: "8",
      l: "bookings today"
    }, {
      n: "€410",
      l: "expected today"
    }, {
      n: "3",
      l: "open slots"
    }, {
      n: "4.9",
      l: "rating"
    }];
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "pp-trial"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "sparkle",
      size: 16,
      color: "var(--brass)"
    }), " You're on the ", /*#__PURE__*/React.createElement("b", null, "3 months free"), " trial \xB7 74 days left"), /*#__PURE__*/React.createElement("div", {
      className: "pp-stats"
    }, stats.map(s => /*#__PURE__*/React.createElement("div", {
      className: "pp-stat",
      key: s.l
    }, /*#__PURE__*/React.createElement("b", null, s.n), /*#__PURE__*/React.createElement("span", null, s.l)))), /*#__PURE__*/React.createElement("h3", {
      className: "pp-h"
    }, "Today \xB7 Kreol Spa"), /*#__PURE__*/React.createElement("div", {
      className: "pp-today"
    }, /*#__PURE__*/React.createElement(BookingCard, {
      service: "Coconut & Frangipani massage",
      studio: "Aline \xB7 60 min",
      when: "14:30",
      price: "\u20AC55",
      status: "Confirmed",
      icon: "spa",
      style: {
        maxWidth: "none"
      }
    }), /*#__PURE__*/React.createElement(BookingCard, {
      service: "Signature facial",
      studio: "New client \xB7 45 min",
      when: "16:00",
      price: "\u20AC48",
      status: "New",
      icon: "sparkle",
      style: {
        maxWidth: "none"
      }
    }), /*#__PURE__*/React.createElement(BookingCard, {
      service: "Scalp ritual",
      studio: "Regular \xB7 30 min",
      when: "17:15",
      price: "\u20AC30",
      status: "Confirmed",
      icon: "lotus",
      style: {
        maxWidth: "none"
      }
    })));
  }
  function ClassesView() {
    const [rows, setRows] = React.useState([{
      day: "Mon",
      time: "07:00",
      name: "Sunrise beach yoga",
      instructor: "with Aline",
      duration: "60 min",
      level: "All levels",
      price: "\u20ac18",
      capacity: 14,
      booked: 8
    }, {
      day: "Wed",
      time: "18:00",
      name: "Candlelight yin",
      instructor: "with Marie",
      duration: "75 min",
      level: "Gentle",
      price: "\u20ac20",
      capacity: 10,
      booked: 8
    }, {
      day: "Sat",
      time: "08:00",
      name: "Personal training \u00b7 small group",
      instructor: "with Denis",
      duration: "45 min",
      level: "Intermediate",
      price: "\u20ac25",
      capacity: 6,
      booked: 6
    }]);
    const setCap = (i, d) => setRows(r => r.map((x, j) => j === i ? {
      ...x,
      capacity: Math.max(x.booked, Math.max(1, x.capacity + d))
    } : x));
    return /*#__PURE__*/React.createElement("div", {
      className: "pp-classes"
    }, /*#__PURE__*/React.createElement("div", {
      className: "pp-hint"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 16,
      color: "var(--eucalyptus)"
    }), " Set your weekly schedule and seat limits. Clients see live spots left and can join a waitlist when a class is full."), rows.map((c, i) => /*#__PURE__*/React.createElement("div", {
      className: "pp-class-row",
      key: i
    }, /*#__PURE__*/React.createElement("div", {
      className: "pp-class-preview"
    }, /*#__PURE__*/React.createElement(ClassCard, _extends({}, c, {
      spotsLeft: c.capacity - c.booked
    }))), /*#__PURE__*/React.createElement("div", {
      className: "pp-class-ctrls"
    }, /*#__PURE__*/React.createElement("span", {
      className: "pp-class-lbl"
    }, "Seat limit"), /*#__PURE__*/React.createElement("div", {
      className: "pp-stepper"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setCap(i, -1),
      "aria-label": "Fewer seats"
    }, "\u2212"), /*#__PURE__*/React.createElement("b", null, c.capacity), /*#__PURE__*/React.createElement("button", {
      onClick: () => setCap(i, 1),
      "aria-label": "More seats"
    }, "+")), /*#__PURE__*/React.createElement("span", {
      className: "pp-booked"
    }, c.booked, " booked \xB7 ", c.capacity - c.booked, " left")))), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary"
    }, "+ Add class"));
  }
  function Placeholder({
    label
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: "pp-placeholder"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "calendar",
      size: 30,
      color: "var(--cocoa-40)"
    }), /*#__PURE__*/React.createElement("p", null, label, " \u2014 coming in this panel."));
  }
  function ProviderPanel() {
    const [tab, setTab] = React.useState("page");
    const active = NAV.find(n => n.key === tab);
    return /*#__PURE__*/React.createElement("div", {
      className: "pp-shell"
    }, /*#__PURE__*/React.createElement("aside", {
      className: "pp-side"
    }, /*#__PURE__*/React.createElement("div", {
      className: "pp-brand"
    }, /*#__PURE__*/React.createElement("span", {
      className: "pp-brand-mark"
    }, "Kreol"), " ", /*#__PURE__*/React.createElement("span", {
      className: "pp-brand-word"
    }, "Spa")), /*#__PURE__*/React.createElement("div", {
      className: "pp-brand-sub"
    }, "Business panel"), /*#__PURE__*/React.createElement("nav", {
      className: "pp-nav"
    }, NAV.map(n => /*#__PURE__*/React.createElement("button", {
      key: n.key,
      className: "pp-nav-item" + (tab === n.key ? " is-active" : ""),
      onClick: () => setTab(n.key)
    }, /*#__PURE__*/React.createElement(Icon, {
      name: n.icon,
      size: 18,
      color: tab === n.key ? "var(--clay)" : "var(--cocoa-60)"
    }), " ", n.label))), /*#__PURE__*/React.createElement("a", {
      className: "pp-viewpublic",
      href: "/search"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "arrowRight",
      size: 16,
      color: "var(--cocoa-60)"
    }), " View public page")), /*#__PURE__*/React.createElement("main", {
      className: "pp-main"
    }, /*#__PURE__*/React.createElement("header", {
      className: "pp-top"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
      className: "pp-title"
    }, active.label), /*#__PURE__*/React.createElement("p", {
      className: "pp-crumb"
    }, "book.sey.la \xB7 Kreol Spa")), /*#__PURE__*/React.createElement("div", {
      className: "pp-top-cta"
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "botanical"
    }, "Live"), /*#__PURE__*/React.createElement(Button, {
      size: "sm"
    }, "+ New booking"))), /*#__PURE__*/React.createElement("div", {
      className: "pp-content"
    }, tab === "page" && /*#__PURE__*/React.createElement(PageEditor, null), tab === "dashboard" && /*#__PURE__*/React.createElement(Dashboard, null), tab === "classes" && /*#__PURE__*/React.createElement(ClassesView, null), tab !== "page" && tab !== "dashboard" && tab !== "classes" && /*#__PURE__*/React.createElement(Placeholder, {
      label: active.label
    }))));
  }
  window.ProviderPanel = ProviderPanel;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/provider/ProviderPanel.jsx", error: String((e && e.message) || e) }); }

// ui_kits/salon/SalonPanel.jsx
try { (() => {
// sey.la | book — Salon panel (responsive). Phone: "My day" agenda. Desktop: swimlane + config.
(function () {
  const {
    Icon
  } = window.SeyLaBookDesignSystem_611419;
  const {
    useState,
    useEffect
  } = React;
  const U = "https://images.unsplash.com/photo-",
    q = "?auto=format&fit=crop&w=120&q=70";
  const STAFF = [{
    id: "a",
    name: "Aline",
    role: "Massage",
    color: "#6F8265",
    soft: "#E7ECE3",
    av: U + "1544005313-94ddf0286df2" + q
  }, {
    id: "d",
    name: "Denis",
    role: "Barber",
    color: "#A8503F",
    soft: "#F1DED6",
    av: U + "1500648767791-00dcc994a43e" + q
  }, {
    id: "m",
    name: "Maya",
    role: "Nails",
    color: "#B2925F",
    soft: "#EFE6D6",
    av: U + "1534528741775-53994a69daeb" + q
  }, {
    id: "n",
    name: "Nadia",
    role: "Facials",
    color: "#5B7B8A",
    soft: "#E1EAEE",
    av: U + "1531123897727-8f129e1688ce" + q
  }];
  // hour grid 9..18
  const HOURS = Array.from({
    length: 10
  }, (_, i) => 9 + i);
  const APPTS = [{
    id: 1,
    staff: "a",
    start: 9,
    len: 1,
    client: "Sara M.",
    svc: "Coconut & frangipani massage",
    price: 55,
    av: U + "1544005313-94ddf0286df2" + q,
    tag: "loyal",
    loyalty: "5/6"
  }, {
    id: 2,
    staff: "a",
    start: 10.5,
    len: 1.25,
    client: "James O.",
    svc: "Deep tissue",
    price: 58,
    av: U + "1500648767791-00dcc994a43e" + q
  }, {
    id: 3,
    staff: "a",
    start: 14,
    len: 1,
    client: "Ravi P.",
    svc: "Hot stone therapy",
    price: 65,
    av: U + "1506794778202-cad84cf45f1d" + q,
    tag: "new"
  }, {
    id: 4,
    staff: "d",
    start: 9.5,
    len: 0.75,
    client: "Marc T.",
    svc: "Skin fade & beard",
    price: 28,
    av: U + "1519085360753-af0119f7cbe7" + q
  }, {
    id: 5,
    staff: "d",
    start: 11,
    len: 0.5,
    client: "Leo K.",
    svc: "Classic cut",
    price: 20,
    av: U + "1507003211169-0a1dd7228f2d" + q,
    tag: "loyal",
    loyalty: "9/10"
  }, {
    id: 6,
    staff: "d",
    start: 13,
    len: 1,
    client: "Blocked · lunch",
    svc: "",
    blocked: true
  }, {
    id: 7,
    staff: "d",
    start: 15,
    len: 0.75,
    client: "Tomas R.",
    svc: "Hot-towel shave",
    price: 22,
    av: U + "1500648767791-00dcc994a43e" + q
  }, {
    id: 8,
    staff: "m",
    start: 10,
    len: 1,
    client: "Nadia R.",
    svc: "BIAB overlay",
    price: 42,
    av: U + "1534528741775-53994a69daeb" + q
  }, {
    id: 9,
    staff: "m",
    start: 12.5,
    len: 0.75,
    client: "Priya S.",
    svc: "Gel manicure",
    price: 30,
    av: U + "1508214751196-bcfd4ca60f91" + q,
    tag: "new"
  }, {
    id: 10,
    staff: "m",
    start: 15.5,
    len: 1,
    client: "Chloe B.",
    svc: "Pedicure spa",
    price: 38,
    av: U + "1544005313-94ddf0286df2" + q
  }, {
    id: 11,
    staff: "n",
    start: 9,
    len: 1,
    client: "Aisha D.",
    svc: "Signature Creole facial",
    price: 48,
    av: U + "1531123897727-8f129e1688ce" + q
  }, {
    id: 12,
    staff: "n",
    start: 11.5,
    len: 0.75,
    client: "Grace W.",
    svc: "Express glow facial",
    price: 32,
    av: U + "1524504388940-b1c1722653e1" + q,
    tag: "loyal",
    loyalty: "3/8"
  }, {
    id: 13,
    staff: "n",
    start: 14.5,
    len: 1,
    client: "Lena F.",
    svc: "LED & peel",
    price: 62,
    av: U + "1502823403499-6ccfcf4fb453" + q
  }];
  const staffOf = id => STAFF.find(s => s.id === id);
  const fmt = h => {
    const hr = Math.floor(h),
      m = Math.round((h - hr) * 60);
    return String(hr).padStart(2, "0") + ":" + String(m).padStart(2, "0");
  };
  function Ic(p) {
    return React.createElement(Icon, Object.assign({
      size: 20
    }, p));
  }

  // ---------- MOBILE: My day agenda ----------
  function Agenda({
    appts,
    onAction,
    checked
  }) {
    const sorted = appts.slice().sort((a, b) => a.start - b.start);
    let lastLabel = null;
    return /*#__PURE__*/React.createElement("div", {
      className: "sp-agenda"
    }, sorted.map(a => {
      const st = staffOf(a.staff);
      const label = a.start < 12 ? "Morning" : a.start < 17 ? "Afternoon" : "Evening";
      const showLabel = label !== lastLabel;
      lastLabel = label;
      if (a.blocked) return /*#__PURE__*/React.createElement(React.Fragment, {
        key: a.id
      }, showLabel && /*#__PURE__*/React.createElement("div", {
        className: "sp-slotlabel"
      }, label), /*#__PURE__*/React.createElement("div", {
        className: "appt",
        style: {
          "--staff": "var(--cocoa-40)",
          background: "var(--shell-alt)"
        }
      }, /*#__PURE__*/React.createElement("div", {
        className: "appt-head"
      }, /*#__PURE__*/React.createElement("span", {
        className: "appt-time"
      }, fmt(a.start)), /*#__PURE__*/React.createElement("span", {
        className: "appt-dur"
      }, "\xB7 lunch break"))));
      const done = checked.includes(a.id);
      return /*#__PURE__*/React.createElement(React.Fragment, {
        key: a.id
      }, showLabel && /*#__PURE__*/React.createElement("div", {
        className: "sp-slotlabel"
      }, label), /*#__PURE__*/React.createElement("div", {
        className: "appt",
        style: {
          "--staff": st.color
        }
      }, /*#__PURE__*/React.createElement("div", {
        className: "appt-head"
      }, /*#__PURE__*/React.createElement("span", {
        className: "appt-time"
      }, fmt(a.start), "\u2013", fmt(a.start + a.len)), /*#__PURE__*/React.createElement("span", {
        className: "appt-dur"
      }, "\xB7 ", Math.round(a.len * 60), " min \xB7 ", st.name)), /*#__PURE__*/React.createElement("div", {
        className: "appt-client"
      }, /*#__PURE__*/React.createElement("img", {
        className: "appt-av",
        src: a.av,
        alt: ""
      }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        className: "appt-name"
      }, a.client), /*#__PURE__*/React.createElement("div", {
        className: "appt-svc"
      }, a.svc)), /*#__PURE__*/React.createElement("span", {
        className: "appt-price"
      }, "\u20AC", a.price)), /*#__PURE__*/React.createElement("div", {
        className: "appt-tags"
      }, a.tag === "new" && /*#__PURE__*/React.createElement("span", {
        className: "tagpill new"
      }, /*#__PURE__*/React.createElement(Ic, {
        name: "sparkle",
        size: 12,
        color: "var(--eucalyptus)"
      }), " New client"), a.tag === "loyal" && /*#__PURE__*/React.createElement("span", {
        className: "tagpill loyal"
      }, /*#__PURE__*/React.createElement(Ic, {
        name: "star",
        size: 12,
        color: "var(--clay)",
        fill: "var(--clay)"
      }), " Loyalty ", a.loyalty)), /*#__PURE__*/React.createElement("div", {
        className: "appt-actions"
      }, /*#__PURE__*/React.createElement("button", {
        className: done ? "done" : "primary",
        onClick: () => onAction("check", a.id)
      }, /*#__PURE__*/React.createElement(Ic, {
        name: "check",
        size: 16,
        color: done ? "var(--eucalyptus)" : "var(--cream)"
      }), " ", done ? "Checked in" : "Check in"), /*#__PURE__*/React.createElement("button", {
        onClick: () => onAction("reschedule", a.id)
      }, /*#__PURE__*/React.createElement(Ic, {
        name: "calendar",
        size: 16
      }), " Move"), /*#__PURE__*/React.createElement("button", {
        onClick: () => onAction("cancel", a.id)
      }, /*#__PURE__*/React.createElement(Ic, {
        name: "close",
        size: 16
      })))));
    }));
  }

  // ---------- DESKTOP: swimlane ----------
  function Swimlane() {
    const rowH = 64; // px per hour
    return /*#__PURE__*/React.createElement("div", {
      className: "sp-cal"
    }, /*#__PURE__*/React.createElement("div", {
      className: "cal-grid",
      style: {
        "--lanes": STAFF.length
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "cal-corner"
    }), STAFF.map(s => /*#__PURE__*/React.createElement("div", {
      className: "cal-staff",
      key: s.id
    }, /*#__PURE__*/React.createElement("img", {
      src: s.av,
      alt: ""
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, s.name), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", null, s.role)))), /*#__PURE__*/React.createElement("div", {
      className: "cal-timecol"
    }, HOURS.map(h => /*#__PURE__*/React.createElement("div", {
      className: "cal-time",
      key: h
    }, fmt(h)))), STAFF.map(s => /*#__PURE__*/React.createElement("div", {
      className: "cal-lane",
      key: s.id
    }, HOURS.map(h => /*#__PURE__*/React.createElement("div", {
      className: "cal-cell",
      key: h
    })), APPTS.filter(a => a.staff === s.id).map(a => /*#__PURE__*/React.createElement("div", {
      key: a.id,
      className: "cal-appt" + (a.blocked ? " blocked" : ""),
      style: {
        top: (a.start - 9) * rowH + 1,
        height: a.len * rowH - 3,
        "--staff": s.color,
        "--staff-soft": s.soft
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "t"
    }, fmt(a.start)), /*#__PURE__*/React.createElement("div", {
      className: "c"
    }, a.client), a.svc && /*#__PURE__*/React.createElement("div", {
      className: "s"
    }, a.svc, " \xB7 \u20AC", a.price)))))));
  }
  function ConfigPanels() {
    const services = [["Coconut & frangipani massage", "60 min", 55], ["Hot stone therapy", "75 min", 65], ["Signature Creole facial", "50 min", 48], ["Skin fade & beard", "45 min", 28]];
    const reviews = [["Sara M.", 5, "Floating after the massage — booking took seconds."], ["James O.", 5, "Same-day slot, spotless place."], ["Nadia R.", 4, "Lovely; weekend parking is tricky."]];
    return /*#__PURE__*/React.createElement("div", {
      className: "sp-config"
    }, /*#__PURE__*/React.createElement("div", {
      className: "cfg"
    }, /*#__PURE__*/React.createElement("h3", null, "Services & pricing"), /*#__PURE__*/React.createElement("p", null, "What clients can book and what they pay."), services.map(s => /*#__PURE__*/React.createElement("div", {
      className: "cfg-row",
      key: s[0]
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, s[0]), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, s[1], " \xB7 ", /*#__PURE__*/React.createElement("span", {
      className: "cfg-price"
    }, "\u20AC", s[2]))))), /*#__PURE__*/React.createElement("div", {
      className: "cfg"
    }, /*#__PURE__*/React.createElement("h3", null, "Team & hours"), /*#__PURE__*/React.createElement("p", null, "Staff, roles and working days."), STAFF.map(s => /*#__PURE__*/React.createElement("div", {
      className: "cfg-row",
      key: s.id
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, s.name), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, s.role, " \xB7 Mon\u2013Sat")))), /*#__PURE__*/React.createElement("div", {
      className: "cfg"
    }, /*#__PURE__*/React.createElement("h3", null, "Google reviews"), /*#__PURE__*/React.createElement("p", null, "Synced from your Google Business profile."), reviews.map(r => /*#__PURE__*/React.createElement("div", {
      className: "cfg-row",
      key: r[0]
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, r[0]), /*#__PURE__*/React.createElement("span", {
      className: "stars-sm"
    }, Array.from({
      length: r[1]
    }).map((_, i) => /*#__PURE__*/React.createElement(Ic, {
      key: i,
      name: "star",
      size: 13,
      color: "var(--clay)",
      fill: "var(--clay)"
    })))))), /*#__PURE__*/React.createElement("div", {
      className: "cfg"
    }, /*#__PURE__*/React.createElement("h3", null, "This week"), /*#__PURE__*/React.createElement("p", null, "Bookings, revenue and utilisation."), /*#__PURE__*/React.createElement("div", {
      className: "cfg-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "Bookings"), /*#__PURE__*/React.createElement("span", {
      className: "cfg-price"
    }, "86")), /*#__PURE__*/React.createElement("div", {
      className: "cfg-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "Revenue"), /*#__PURE__*/React.createElement("span", {
      className: "cfg-price"
    }, "\u20AC3,940")), /*#__PURE__*/React.createElement("div", {
      className: "cfg-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "Chair utilisation"), /*#__PURE__*/React.createElement("span", {
      className: "cfg-price"
    }, "78%")), /*#__PURE__*/React.createElement("div", {
      className: "cfg-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "New clients"), /*#__PURE__*/React.createElement("span", {
      className: "cfg-price"
    }, "14"))));
  }

  // ---------- Appointment sheet (new / edit / block) ----------
  function ApptSheet({
    mode,
    appt,
    onClose,
    onSave,
    onDelete
  }) {
    const [block, setBlock] = useState(mode === "block");
    const [client, setClient] = useState(appt ? appt.client : "");
    const [staff, setStaff] = useState(appt ? appt.staff : STAFF[0].id);
    const [time, setTime] = useState(appt ? fmt(appt.start) : "10:00");
    const svc = appt ? appt.svc : "";
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "sp-scrim",
      onClick: onClose
    }), /*#__PURE__*/React.createElement("div", {
      className: "sp-sheet"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sp-sheet-grab"
    }), /*#__PURE__*/React.createElement("div", {
      className: "sp-sheet-title"
    }, mode === "edit" ? "Edit appointment" : block ? "Block time" : "New appointment"), mode !== "edit" && /*#__PURE__*/React.createElement("div", {
      className: "seg"
    }, /*#__PURE__*/React.createElement("button", {
      className: !block ? "is-on" : "",
      onClick: () => setBlock(false)
    }, "Appointment"), /*#__PURE__*/React.createElement("button", {
      className: block ? "is-on" : "",
      onClick: () => setBlock(true)
    }, "Block time")), !block && /*#__PURE__*/React.createElement("label", {
      className: "sp-field"
    }, /*#__PURE__*/React.createElement("span", null, "Client"), /*#__PURE__*/React.createElement("input", {
      value: client,
      onChange: e => setClient(e.target.value),
      placeholder: "Name or phone (walk-in / call)"
    })), !block && /*#__PURE__*/React.createElement("label", {
      className: "sp-field"
    }, /*#__PURE__*/React.createElement("span", null, "Service"), /*#__PURE__*/React.createElement("input", {
      defaultValue: svc,
      placeholder: "e.g. Skin fade & beard \xB7 \u20AC28"
    })), /*#__PURE__*/React.createElement("label", {
      className: "sp-field"
    }, /*#__PURE__*/React.createElement("span", null, "Staff"), /*#__PURE__*/React.createElement("select", {
      value: staff,
      onChange: e => setStaff(e.target.value)
    }, STAFF.map(s => /*#__PURE__*/React.createElement("option", {
      key: s.id,
      value: s.id
    }, s.name, " \xB7 ", s.role)))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("label", {
      className: "sp-field",
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("span", null, "Time"), /*#__PURE__*/React.createElement("input", {
      value: time,
      onChange: e => setTime(e.target.value)
    })), /*#__PURE__*/React.createElement("label", {
      className: "sp-field",
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("span", null, "Duration"), /*#__PURE__*/React.createElement("select", {
      defaultValue: "60"
    }, /*#__PURE__*/React.createElement("option", null, "30 min"), /*#__PURE__*/React.createElement("option", null, "45 min"), /*#__PURE__*/React.createElement("option", {
      value: "60"
    }, "60 min"), /*#__PURE__*/React.createElement("option", null, "90 min")))), block && /*#__PURE__*/React.createElement("label", {
      className: "sp-field"
    }, /*#__PURE__*/React.createElement("span", null, "Reason"), /*#__PURE__*/React.createElement("input", {
      placeholder: "Lunch, admin, holiday\u2026"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 10,
        marginTop: 8
      }
    }, mode === "edit" && /*#__PURE__*/React.createElement("button", {
      className: "sp-btn ghost danger",
      onClick: onDelete
    }, "Cancel appt"), /*#__PURE__*/React.createElement("button", {
      className: "sp-btn primary",
      style: {
        flex: 1
      },
      onClick: () => onSave({
        client,
        staff,
        time,
        block
      })
    }, mode === "edit" ? "Save changes" : block ? "Block time" : "Add appointment"))));
  }

  // ---------- Clients (list + profile with history + notes) ----------
  const CLIENTS = [{
    id: "c1",
    name: "Sara M.",
    av: STAFF[0].av,
    phone: "+248 251 8842",
    visits: 12,
    spend: 640,
    loyalty: "5/6",
    note: "Prefers Aline. Sensitive skin — no strong oils.",
    history: [["Coconut & frangipani massage", "€55", "3 Jul"], ["Signature Creole facial", "€48", "12 Jun"], ["Hot stone therapy", "€65", "28 May"]]
  }, {
    id: "c2",
    name: "James O.",
    av: STAFF[1].av,
    phone: "+248 271 4410",
    visits: 6,
    spend: 180,
    loyalty: "3/10",
    note: "Always books Denis. Skin fade, no product.",
    history: [["Skin fade & beard", "€28", "2 Jul"], ["Classic cut", "€20", "5 Jun"]]
  }, {
    id: "c3",
    name: "Nadia R.",
    av: STAFF[2].av,
    phone: "+248 259 1173",
    visits: 9,
    spend: 312,
    loyalty: "8/8 · reward due",
    note: "Gel manicure, loves nail art.",
    history: [["BIAB overlay", "€42", "1 Jul"], ["Gel manicure", "€30", "10 Jun"]]
  }];
  function ClientsPanel({
    onOpen
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: "sp-config",
      style: {
        gridTemplateColumns: "1fr"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "cfg"
    }, /*#__PURE__*/React.createElement("h3", null, "Clients"), /*#__PURE__*/React.createElement("p", null, "Everyone who's booked with you."), CLIENTS.map(c => /*#__PURE__*/React.createElement("div", {
      className: "cfg-row",
      key: c.id,
      style: {
        cursor: "pointer"
      },
      onClick: () => onOpen(c)
    }, /*#__PURE__*/React.createElement("span", {
      className: "k",
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: c.av,
      alt: "",
      style: {
        width: 34,
        height: 34,
        borderRadius: "50%",
        objectFit: "cover"
      }
    }), c.name), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, c.visits, " visits \xB7 \u20AC", c.spend, " ", /*#__PURE__*/React.createElement(Ic, {
      name: "chevronRight",
      size: 16,
      color: "var(--cocoa-40)"
    }))))));
  }
  function ClientSheet({
    c,
    onClose
  }) {
    const [note, setNote] = useState(c.note);
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "sp-scrim",
      onClick: onClose
    }), /*#__PURE__*/React.createElement("div", {
      className: "sp-sheet"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sp-sheet-grab"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: c.av,
      alt: "",
      style: {
        width: 52,
        height: 52,
        borderRadius: "50%",
        objectFit: "cover"
      }
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "sp-sheet-title",
      style: {
        margin: 0
      }
    }, c.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: "0.82rem",
        color: "var(--cocoa-60)"
      }
    }, c.phone)), /*#__PURE__*/React.createElement("span", {
      className: "tagpill loyal",
      style: {
        marginLeft: "auto"
      }
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "star",
      size: 12,
      color: "var(--clay)",
      fill: "var(--clay)"
    }), " ", c.loyalty)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 10,
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "sp-kpi",
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "n"
    }, c.visits), /*#__PURE__*/React.createElement("div", {
      className: "l"
    }, "visits")), /*#__PURE__*/React.createElement("div", {
      className: "sp-kpi",
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "n"
    }, "\u20AC", c.spend), /*#__PURE__*/React.createElement("div", {
      className: "l"
    }, "lifetime"))), /*#__PURE__*/React.createElement("label", {
      className: "sp-field"
    }, /*#__PURE__*/React.createElement("span", null, "Private note"), /*#__PURE__*/React.createElement("textarea", {
      value: note,
      onChange: e => setNote(e.target.value),
      rows: 2
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: "0.72rem",
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: "var(--cocoa-40)",
        margin: "10px 0 6px"
      }
    }, "History"), c.history.map((h, i) => /*#__PURE__*/React.createElement("div", {
      className: "cfg-row",
      key: i
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, h[0]), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, h[1], " \xB7 ", h[2]))), /*#__PURE__*/React.createElement("button", {
      className: "sp-btn primary",
      style: {
        width: "100%",
        marginTop: 12
      },
      onClick: onClose
    }, "Done")));
  }

  // ---------- Marketing ----------
  function MarketingPanel() {
    return /*#__PURE__*/React.createElement("div", {
      className: "sp-config"
    }, /*#__PURE__*/React.createElement("div", {
      className: "cfg"
    }, /*#__PURE__*/React.createElement("h3", null, "Promotions"), /*#__PURE__*/React.createElement("p", null, "Fill quiet hours and reward regulars."), /*#__PURE__*/React.createElement("div", {
      className: "cfg-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "Happy hour \xB7 20% off"), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, "Mon\u2013Thu, 14\u201316h \xB7 ", /*#__PURE__*/React.createElement("b", {
      style: {
        color: "var(--eucalyptus)"
      }
    }, "Live"))), /*#__PURE__*/React.createElement("div", {
      className: "cfg-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "First visit \xB7 \u20AC10 off"), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, "New clients \xB7 ", /*#__PURE__*/React.createElement("b", {
      style: {
        color: "var(--eucalyptus)"
      }
    }, "Live"))), /*#__PURE__*/React.createElement("div", {
      className: "cfg-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "Bring a friend"), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, "Both get \u20AC5 \xB7 Draft")), /*#__PURE__*/React.createElement("button", {
      className: "sp-btn primary",
      style: {
        width: "100%",
        marginTop: 12
      }
    }, "+ New promotion")), /*#__PURE__*/React.createElement("div", {
      className: "cfg"
    }, /*#__PURE__*/React.createElement("h3", null, "Discount codes"), /*#__PURE__*/React.createElement("p", null, "Share on Instagram or with regulars."), /*#__PURE__*/React.createElement("div", {
      className: "cfg-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "ISLAND15"), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, "15% off \xB7 42 used")), /*#__PURE__*/React.createElement("div", {
      className: "cfg-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "WELCOME"), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, "\u20AC10 off \xB7 128 used")), /*#__PURE__*/React.createElement("button", {
      className: "sp-btn ghost",
      style: {
        width: "100%",
        marginTop: 12
      }
    }, "+ Create code")), /*#__PURE__*/React.createElement("div", {
      className: "cfg"
    }, /*#__PURE__*/React.createElement("h3", null, "Message blast"), /*#__PURE__*/React.createElement("p", null, "Reach your clients by push / SMS."), /*#__PURE__*/React.createElement("div", {
      className: "cfg-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "Audience"), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, "All clients \xB7 312")), /*#__PURE__*/React.createElement("div", {
      className: "cfg-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "k"
    }, "Last sent"), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, "\"Weekend slots open\" \xB7 2d ago")), /*#__PURE__*/React.createElement("button", {
      className: "sp-btn primary",
      style: {
        width: "100%",
        marginTop: 12
      }
    }, "Compose blast")));
  }

  // ---------- Onboarding (first-run wizard) ----------
  function Onboarding({
    onClose
  }) {
    const [step, setStep] = useState(0);
    const steps = [{
      t: "Add your services",
      d: "List what clients can book and set prices. Import from your current menu.",
      ic: "sparkle"
    }, {
      t: "Add your team",
      d: "Invite staff and set their roles and working hours.",
      ic: "star"
    }, {
      t: "Set opening hours",
      d: "When are you open? Add breaks and days off.",
      ic: "clock"
    }, {
      t: "Import Google reviews",
      d: "Connect your Google Business profile to show your reviews.",
      ic: "shield"
    }];
    const s = steps[step];
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "sp-scrim",
      onClick: onClose
    }), /*#__PURE__*/React.createElement("div", {
      className: "sp-sheet"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sp-sheet-grab"
    }), /*#__PURE__*/React.createElement("div", {
      className: "stepdots",
      style: {
        marginBottom: 16
      }
    }, steps.map((_, i) => /*#__PURE__*/React.createElement("span", {
      key: i,
      className: "stepdot" + (i <= step ? " is-on" : "")
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 56,
        height: 56,
        borderRadius: 16,
        background: "var(--shell-alt)",
        display: "grid",
        placeItems: "center",
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement(Ic, {
      name: s.ic,
      size: 26
    })), /*#__PURE__*/React.createElement("div", {
      className: "sp-sheet-title"
    }, s.t), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--cocoa-60)",
        margin: "0 0 16px",
        fontSize: "0.92rem"
      }
    }, s.d), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "sp-btn ghost",
      onClick: onClose
    }, "Skip setup"), /*#__PURE__*/React.createElement("button", {
      className: "sp-btn primary",
      style: {
        flex: 1
      },
      onClick: () => step < steps.length - 1 ? setStep(step + 1) : onClose()
    }, step < steps.length - 1 ? "Next" : "Finish — go live"))));
  }

  // ---------- Shell ----------
  function SalonPanel() {
    const [checked, setChecked] = useState([]);
    const [toast, setToast] = useState(null);
    const [view, setView] = useState("calendar"); // desktop nav
    const [appts, setAppts] = useState(APPTS.filter(a => a.staff === "a" || a.staff === "d")); // My day = today's staff on shift (subset)
    const [sheet, setSheet] = useState(null); // {kind:'new'|'edit'|'block', appt?}
    const [client, setClient] = useState(null);
    const [onboard, setOnboard] = useState(false);
    const flash = m => {
      setToast(m);
      setTimeout(() => setToast(null), 1600);
    };
    function onAction(kind, id) {
      if (kind === "check") {
        setChecked(c => c.includes(id) ? c.filter(x => x !== id) : [...c, id]);
      } else if (kind === "cancel") {
        setAppts(a => a.filter(x => x.id !== id));
        flash("Appointment cancelled — client notified");
      } else if (kind === "reschedule") {
        setSheet({
          kind: "edit",
          appt: appts.find(a => a.id === id)
        });
      }
    }
    const nav = [["calendar", "calendar", "Calendar"], ["config", "sparkle", "Services"], ["clients", "heart", "Clients"], ["marketing", "star", "Marketing"], ["reviews", "shield", "Reviews"], ["stats", "shield", "Insights"]];
    const kpis = [["12", "today's bookings"], ["€640", "expected"], ["2", "gaps to fill"], ["4", "staff on shift"]];
    return /*#__PURE__*/React.createElement("div", {
      className: "sp"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sp-top"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sp-brand"
    }, /*#__PURE__*/React.createElement("b", null, "sey.la"), /*#__PURE__*/React.createElement("span", null, "|"), /*#__PURE__*/React.createElement("i", null, "book")), /*#__PURE__*/React.createElement("span", {
      className: "sp-badge"
    }, "Studio"), /*#__PURE__*/React.createElement("div", {
      className: "sp-spacer"
    }), /*#__PURE__*/React.createElement("button", {
      className: "sp-icbtn",
      "aria-label": "Notifications"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "calendar",
      size: 18
    })), /*#__PURE__*/React.createElement("img", {
      className: "sp-avatar",
      src: U + "1600334129128-685c5582fd35" + q,
      alt: "Kreol Spa"
    })), /*#__PURE__*/React.createElement("div", {
      className: "sp-body"
    }, /*#__PURE__*/React.createElement("aside", {
      className: "sp-side"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sp-navsec"
    }, "Kreol Spa \xB7 Beau Vallon"), nav.map(n => /*#__PURE__*/React.createElement("div", {
      key: n[0],
      className: "sp-navitem" + (view === n[0] ? " is-active" : ""),
      onClick: () => setView(n[0])
    }, /*#__PURE__*/React.createElement(Ic, {
      name: n[1],
      size: 19,
      color: view === n[0] ? "var(--cream)" : "var(--ink)"
    }), " ", n[2])), /*#__PURE__*/React.createElement("div", {
      className: "sp-navsec"
    }, "Account"), /*#__PURE__*/React.createElement("div", {
      className: "sp-navitem",
      onClick: () => setOnboard(true)
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "sparkle",
      size: 19
    }), " Finish setup"), /*#__PURE__*/React.createElement("div", {
      className: "sp-navitem"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "pin",
      size: 19
    }), " Your page"), /*#__PURE__*/React.createElement("div", {
      className: "sp-navitem"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "shield",
      size: 19
    }), " Subscription")), /*#__PURE__*/React.createElement("main", {
      className: "sp-main"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sp-datebar"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sp-daynav"
    }, /*#__PURE__*/React.createElement("button", {
      "aria-label": "Prev"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "chevronDown",
      size: 16,
      style: {
        transform: "rotate(90deg)"
      }
    })), /*#__PURE__*/React.createElement("button", {
      "aria-label": "Next"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "chevronRight",
      size: 16
    }))), /*#__PURE__*/React.createElement("h1", null, "Today \xB7 Thu 3 Jul")), /*#__PURE__*/React.createElement("div", {
      className: "sp-kpis"
    }, kpis.map(k => /*#__PURE__*/React.createElement("div", {
      className: "sp-kpi",
      key: k[1]
    }, /*#__PURE__*/React.createElement("div", {
      className: "n"
    }, k[0]), /*#__PURE__*/React.createElement("div", {
      className: "l"
    }, k[1])))), /*#__PURE__*/React.createElement(Agenda, {
      appts: appts,
      onAction: onAction,
      checked: checked
    }), /*#__PURE__*/React.createElement("div", {
      className: "sp-view sp-view--calendar" + (view === "calendar" ? " is-shown" : "")
    }, /*#__PURE__*/React.createElement(Swimlane, null)), /*#__PURE__*/React.createElement("div", {
      className: "sp-view sp-view--config" + (view === "config" ? " is-shown" : "")
    }, /*#__PURE__*/React.createElement(ConfigPanels, null)), /*#__PURE__*/React.createElement("div", {
      className: "sp-view sp-view--reviews" + (view === "reviews" ? " is-shown" : "")
    }, /*#__PURE__*/React.createElement(ConfigPanels, null)), /*#__PURE__*/React.createElement("div", {
      className: "sp-view sp-view--stats" + (view === "stats" ? " is-shown" : "")
    }, /*#__PURE__*/React.createElement(ConfigPanels, null)), /*#__PURE__*/React.createElement("div", {
      className: "sp-view sp-view--clients" + (view === "clients" ? " is-shown" : "")
    }, /*#__PURE__*/React.createElement(ClientsPanel, {
      onOpen: setClient
    })), /*#__PURE__*/React.createElement("div", {
      className: "sp-view sp-view--marketing" + (view === "marketing" ? " is-shown" : "")
    }, /*#__PURE__*/React.createElement(MarketingPanel, null)))), /*#__PURE__*/React.createElement("div", {
      className: "sp-fab"
    }, /*#__PURE__*/React.createElement("button", {
      className: "ghost",
      "aria-label": "Search"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "search",
      size: 20
    })), /*#__PURE__*/React.createElement("button", {
      className: "primary",
      onClick: () => setSheet({
        kind: "new"
      })
    }, "+ New appointment")), toast && /*#__PURE__*/React.createElement("div", {
      className: "toast",
      style: {
        position: "fixed",
        bottom: 84
      }
    }, toast), sheet && /*#__PURE__*/React.createElement(ApptSheet, {
      mode: sheet.kind,
      appt: sheet.appt,
      onClose: () => setSheet(null),
      onSave: () => {
        setSheet(null);
        flash(sheet.kind === "edit" ? "Appointment updated" : "Appointment added");
      },
      onDelete: () => {
        setAppts(a => a.filter(x => x.id !== sheet.appt.id));
        setSheet(null);
        flash("Appointment cancelled — client notified");
      }
    }), client && /*#__PURE__*/React.createElement(ClientSheet, {
      c: client,
      onClose: () => setClient(null)
    }), onboard && /*#__PURE__*/React.createElement(Onboarding, {
      onClose: () => setOnboard(false)
    }));
  }
  window.SalonPanel = SalonPanel;
  ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(SalonPanel, null));
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/salon/SalonPanel.jsx", error: String((e && e.message) || e) }); }

// ui_kits/search/SearchPage.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// SearchPage — client-facing browse / results page in the sey.la | book pattern.
(function () {
  const {
    Logo,
    SearchBar,
    StudioCard,
    ClassCard,
    Button,
    Icon,
    Badge
  } = window.SeyLaBookDesignSystem_611419;
  const U = "https://images.unsplash.com/photo-";
  const CHIPS = ["All", "Hair", "Barber", "Nails", "Brows & lashes", "Spa & massage", "Skin & facial", "Makeup", "Waxing", "Tattoo", "Piercing", "Fitness & yoga", "Personal trainer", "Classes"];
  const CLASSES = [{
    day: "Mon",
    time: "07:00",
    name: "Sunrise beach yoga",
    instructor: "Kreol Spa · with Aline",
    duration: "60 min",
    level: "All levels",
    price: "€18",
    spotsLeft: 6,
    capacity: 14
  }, {
    day: "Tue",
    time: "18:30",
    name: "Personal training · small group",
    instructor: "North Shore Fitness · with Denis",
    duration: "45 min",
    level: "Intermediate",
    price: "€25",
    spotsLeft: 2,
    capacity: 6
  }, {
    day: "Wed",
    time: "18:00",
    name: "Candlelight yin",
    instructor: "Zen Shore · with Marie",
    duration: "75 min",
    level: "Gentle",
    price: "€20",
    spotsLeft: 0,
    capacity: 10
  }, {
    day: "Fri",
    time: "06:45",
    name: "Sunrise HIIT",
    instructor: "Anse Fit · with Kevin",
    duration: "40 min",
    level: "Advanced",
    price: "€22",
    spotsLeft: 9,
    capacity: 16
  }, {
    day: "Sat",
    time: "09:00",
    name: "Flow & breath",
    instructor: "Kreol Spa · with Aline",
    duration: "60 min",
    level: "All levels",
    price: "€18",
    spotsLeft: 4,
    capacity: 14
  }];
  const STUDIOS = [{
    name: "Kreol Spa",
    location: "Beau Vallon, Mahé",
    category: "Spa & massage",
    image: U + "1519823551278-64ac92734fb1",
    rating: 4.9,
    reviews: 214,
    badge: "Popular",
    services: [{
      name: "Coconut & Frangipani massage",
      duration: "60 min",
      price: "€55"
    }, {
      name: "Signature facial",
      duration: "50 min",
      price: "€48"
    }]
  }, {
    name: "Palm & Blade",
    location: "Victoria, Mahé",
    category: "Barber",
    image: U + "1512864084360-7c0c4d0a0845",
    rating: 4.8,
    reviews: 132,
    badge: "Loved by locals",
    services: [{
      name: "Skin fade & style",
      duration: "40 min",
      price: "€22"
    }, {
      name: "Beard trim & hot towel",
      duration: "25 min",
      price: "€16"
    }]
  }, {
    name: "Lumière Studio",
    location: "Victoria, Mahé",
    category: "Hair",
    image: U + "1632765866070-3fadf25d3d5b",
    rating: 4.8,
    reviews: 176,
    services: [{
      name: "Cut & blow-dry",
      duration: "45 min",
      price: "€30"
    }, {
      name: "Braids & styling",
      duration: "120 min",
      price: "€60"
    }]
  }, {
    name: "North Shore Grooming",
    location: "Beau Vallon, Mahé",
    category: "Barber",
    image: U + "1699641975121-5c3f55a553e5",
    rating: 4.9,
    reviews: 121,
    services: [{
      name: "Cut, beard & hot towel",
      duration: "45 min",
      price: "€26"
    }, {
      name: "Sports recovery massage",
      duration: "30 min",
      price: "€32"
    }]
  }, {
    name: "Frangipani Nails",
    location: "Grand Anse, Praslin",
    category: "Nails",
    image: U + "1632345031435-8727f6897d53",
    rating: 4.9,
    reviews: 98,
    services: [{
      name: "Gel manicure",
      duration: "45 min",
      price: "€25"
    }, {
      name: "Spa pedicure",
      duration: "60 min",
      price: "€35"
    }]
  }, {
    name: "Island Glow",
    location: "La Digue",
    category: "Brows & lashes",
    image: U + "1632765854612-9b02b6ec2b15",
    rating: 4.7,
    reviews: 64,
    available: "",
    services: [{
      name: "Brow lamination",
      duration: "40 min",
      price: "€35"
    }, {
      name: "Lash lift & tint",
      duration: "50 min",
      price: "€42"
    }]
  }, {
    name: "Zen Shore",
    location: "Anse Royale, Mahé",
    category: "Spa & massage",
    image: U + "1696841212541-449ca29397cc",
    rating: 5.0,
    reviews: 87,
    services: [{
      name: "Hot stone therapy",
      duration: "75 min",
      price: "€65"
    }, {
      name: "Scalp ritual",
      duration: "30 min",
      price: "€30"
    }]
  }, {
    name: "Takamaka Wellness",
    location: "Takamaka, Mahé",
    category: "Skin & facial",
    image: U + "1570172619644-dfd03ed5d881",
    rating: 4.8,
    reviews: 73,
    services: [{
      name: "Volcanic clay facial",
      duration: "50 min",
      price: "€44"
    }, {
      name: "Deep-tissue massage",
      duration: "60 min",
      price: "€58"
    }]
  }, {
    name: "Coco Makeup Bar",
    location: "Victoria, Mahé",
    category: "Makeup",
    image: U + "1516975080664-ed2fc6a32937",
    rating: 4.7,
    reviews: 52,
    services: [{
      name: "Event makeup",
      duration: "60 min",
      price: "€48"
    }, {
      name: "Bridal trial",
      duration: "90 min",
      price: "€70"
    }]
  }];
  const SORTS = ["Recommended", "Top rated", "Nearest", "Price: low to high"];
  function SearchPage() {
    const [cat, setCat] = React.useState("All");
    const [sort, setSort] = React.useState("Recommended");
    const [mapOpen, setMapOpen] = React.useState(false);
    const isClasses = cat === "Classes";
    let results = STUDIOS.filter(s => cat === "All" || s.category === cat);
    if (sort === "Top rated") results = [...results].sort((a, b) => b.rating - a.rating);
    if (sort === "Price: low to high") results = [...results].sort((a, b) => parseInt(a.services[0].price.slice(1)) - parseInt(b.services[0].price.slice(1)));
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("header", {
      className: "sr-nav"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sey-container sr-nav-inner"
    }, /*#__PURE__*/React.createElement(Logo, null), /*#__PURE__*/React.createElement("div", {
      className: "sr-nav-right"
    }, /*#__PURE__*/React.createElement("a", {
      href: "/for-studios"
    }, "For studios"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm"
    }, "Log in")))), /*#__PURE__*/React.createElement("section", {
      className: "sr-head"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sey-container"
    }, /*#__PURE__*/React.createElement("h1", {
      className: "sr-title"
    }, "Browse studios in the ", /*#__PURE__*/React.createElement("em", {
      className: "sey-accent-italic"
    }, "Seychelles")), /*#__PURE__*/React.createElement("div", {
      className: "sr-search"
    }, /*#__PURE__*/React.createElement(SearchBar, {
      withDate: true,
      cta: "Search"
    })), /*#__PURE__*/React.createElement("div", {
      className: "sr-chips"
    }, CHIPS.map(c => /*#__PURE__*/React.createElement("button", {
      key: c,
      className: "sr-chip" + (cat === c ? " is-active" : ""),
      onClick: () => setCat(c)
    }, c))))), /*#__PURE__*/React.createElement("section", {
      className: "sr-body"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sey-container"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sr-meta"
    }, /*#__PURE__*/React.createElement("span", {
      className: "sr-count"
    }, isClasses ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("b", null, CLASSES.length), " classes this week across the islands") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("b", null, results.length), " studio", results.length !== 1 ? "s" : "", cat !== "All" ? " · " + cat : "", " on Mah\xE9, Praslin & La Digue")), /*#__PURE__*/React.createElement("div", {
      className: "sr-controls"
    }, /*#__PURE__*/React.createElement("label", {
      className: "sr-sort"
    }, /*#__PURE__*/React.createElement("span", null, "Sort"), /*#__PURE__*/React.createElement("select", {
      value: sort,
      onChange: e => setSort(e.target.value)
    }, SORTS.map(s => /*#__PURE__*/React.createElement("option", {
      key: s
    }, s)))), /*#__PURE__*/React.createElement("button", {
      className: "sr-maptoggle" + (mapOpen ? " is-active" : ""),
      onClick: () => setMapOpen(v => !v)
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "pin",
      size: 16,
      color: mapOpen ? "var(--surface)" : "var(--clay)"
    }), " ", mapOpen ? "Hide map" : "Map"))), /*#__PURE__*/React.createElement("div", {
      className: "sr-layout" + (mapOpen && !isClasses ? " sr-layout--map" : "")
    }, isClasses ? /*#__PURE__*/React.createElement("div", {
      className: "sr-classes"
    }, CLASSES.map((c, i) => /*#__PURE__*/React.createElement(ClassCard, _extends({
      key: i
    }, c)))) : /*#__PURE__*/React.createElement("div", {
      className: "sr-grid"
    }, results.length === 0 ? /*#__PURE__*/React.createElement("div", {
      className: "sr-empty"
    }, /*#__PURE__*/React.createElement("h3", null, "No studios here yet"), /*#__PURE__*/React.createElement("p", null, "We're onboarding ", cat.toLowerCase(), " studios across the islands. Check back soon.")) : results.map(s => /*#__PURE__*/React.createElement(StudioCard, _extends({
      key: s.name
    }, s)))), mapOpen && !isClasses && /*#__PURE__*/React.createElement("aside", {
      className: "sr-map",
      "aria-label": "Map"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sr-map-inner"
    }, results.slice(0, 6).map((s, i) => /*#__PURE__*/React.createElement("span", {
      className: "sr-map-pin",
      key: s.name,
      style: {
        top: 18 + i * 12 + "%",
        left: 20 + i * 27 % 60 + "%"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "pin",
      size: 18,
      color: "var(--surface)"
    }))), /*#__PURE__*/React.createElement("span", {
      className: "sr-map-label"
    }, "Live availability \xB7 Beau Vallon")))))), /*#__PURE__*/React.createElement("footer", {
      className: "sr-footer"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sey-container sr-footer-inner"
    }, /*#__PURE__*/React.createElement(Logo, null), /*#__PURE__*/React.createElement("nav", {
      className: "sr-footer-nav"
    }, /*#__PURE__*/React.createElement("a", {
      href: "/"
    }, "Home"), /*#__PURE__*/React.createElement("a", {
      href: "/for-studios"
    }, "For studios"), /*#__PURE__*/React.createElement("a", {
      href: "/about"
    }, "About"), /*#__PURE__*/React.createElement("a", {
      href: "/contact"
    }, "Contact")), /*#__PURE__*/React.createElement("span", {
      className: "sr-footer-copy"
    }, "\xA9 2026 sey.la \xB7 Always free for clients"))));
  }
  window.SearchPage = SearchPage;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/search/SearchPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/studios/StudiosClose.jsx
try { (() => {
// StudiosClose — pricing clarity, final sign-up CTA, and B2B footer.
(function () {
  const {
    SectionHeader,
    Button,
    Input,
    Icon,
    Logo
  } = window.SeyLaBookDesignSystem_611419;
  const INCLUDED = ["Live real-time calendar", "Verified local listing", "Automatic reminders", "Cancellation protection", "Client messaging", "No commission on clients"];
  function StudiosClose() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("section", {
      className: "st-section",
      id: "pricing"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sey-container"
    }, /*#__PURE__*/React.createElement(SectionHeader, {
      align: "center",
      eyebrow: "Simple, honest pricing",
      title: "Free to start on the",
      accent: "islands.",
      intro: "List your studio and take bookings for free. A small flat fee applies only on completed bookings \u2014 never a cut of your service price."
    }), /*#__PURE__*/React.createElement("div", {
      className: "st-pricing"
    }, /*#__PURE__*/React.createElement("div", {
      className: "st-price-head"
    }, /*#__PURE__*/React.createElement("span", {
      className: "st-price-amt"
    }, "Free"), /*#__PURE__*/React.createElement("span", {
      className: "st-price-per"
    }, "to list & go live")), /*#__PURE__*/React.createElement("div", {
      className: "st-price-flat"
    }, "then ", /*#__PURE__*/React.createElement("b", null, "\u20AC1"), " per completed booking \xB7 nothing on cancellations"), /*#__PURE__*/React.createElement("ul", {
      className: "st-price-list"
    }, INCLUDED.map(f => /*#__PURE__*/React.createElement("li", {
      key: f
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 17,
      color: "var(--eucalyptus)"
    }), " ", f))), /*#__PURE__*/React.createElement(Button, {
      full: true,
      size: "lg"
    }, "Create your studio account")))), /*#__PURE__*/React.createElement("section", {
      className: "st-section st-final"
    }, /*#__PURE__*/React.createElement("div", {
      className: "lp-bloom lp-bloom--final",
      "aria-hidden": "true"
    }), /*#__PURE__*/React.createElement("div", {
      className: "sey-container st-final-inner"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "st-final-title"
    }, "Ready to open your ", /*#__PURE__*/React.createElement("em", {
      className: "sey-accent-italic"
    }, "calendar?")), /*#__PURE__*/React.createElement("p", {
      className: "st-final-lead"
    }, "Join the studios booking through sey.la across the Seychelles."), /*#__PURE__*/React.createElement("form", {
      className: "st-final-form",
      onSubmit: e => e.preventDefault()
    }, /*#__PURE__*/React.createElement(Input, {
      type: "email",
      placeholder: "Your studio email",
      "aria-label": "Studio email",
      containerStyle: {
        flex: 1
      }
    }), /*#__PURE__*/React.createElement(Button, {
      type: "submit",
      size: "md"
    }, "Get started")))), /*#__PURE__*/React.createElement("footer", {
      className: "st-footer"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sey-container st-footer-inner"
    }, /*#__PURE__*/React.createElement("div", {
      className: "st-footer-brand"
    }, /*#__PURE__*/React.createElement(Logo, {
      color: "var(--cream)",
      mono: true
    }), /*#__PURE__*/React.createElement("p", null, "The calm way to run a full calendar \u2014 for beauty & wellness studios across the Seychelles.")), /*#__PURE__*/React.createElement("nav", {
      className: "st-footer-nav",
      "aria-label": "Footer"
    }, /*#__PURE__*/React.createElement("a", {
      href: "#features"
    }, "Features"), /*#__PURE__*/React.createElement("a", {
      href: "#how"
    }, "How it works"), /*#__PURE__*/React.createElement("a", {
      href: "#pricing"
    }, "Pricing"), /*#__PURE__*/React.createElement("a", {
      href: "/"
    }, "For clients \u2197"))), /*#__PURE__*/React.createElement("div", {
      className: "sey-container st-footer-bottom"
    }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 sey.la"), /*#__PURE__*/React.createElement("div", {
      className: "st-footer-links"
    }, /*#__PURE__*/React.createElement("a", {
      href: "#"
    }, "Privacy"), /*#__PURE__*/React.createElement("a", {
      href: "#"
    }, "Terms"), /*#__PURE__*/React.createElement("a", {
      href: "#"
    }, "Support")))));
  }
  window.StudiosClose = StudiosClose;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/studios/StudiosClose.jsx", error: String((e && e.message) || e) }); }

// ui_kits/studios/StudiosHero.jsx
try { (() => {
// StudiosHero — B2B pitch + sign-up + a live "today at your studio" dashboard preview.
(function () {
  const {
    Button,
    Input,
    Badge,
    Icon,
    BookingCard
  } = window.SeyLaBookDesignSystem_611419;
  function StudiosHero() {
    return /*#__PURE__*/React.createElement("section", {
      className: "st-hero"
    }, /*#__PURE__*/React.createElement("div", {
      className: "lp-bloom lp-bloom--1",
      "aria-hidden": "true"
    }), /*#__PURE__*/React.createElement("div", {
      className: "lp-bloom lp-bloom--2",
      "aria-hidden": "true"
    }), /*#__PURE__*/React.createElement("div", {
      className: "sey-container st-hero-grid"
    }, /*#__PURE__*/React.createElement("div", {
      className: "st-hero-copy lp-fade"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sey-eyebrow st-hero-eyebrow"
    }, "For studios & spas \xB7 Seychelles"), /*#__PURE__*/React.createElement("h1", {
      className: "st-hero-title"
    }, "Fill your calendar.", /*#__PURE__*/React.createElement("br", null), "Keep your ", /*#__PURE__*/React.createElement("em", {
      className: "sey-accent-italic"
    }, "calm.")), /*#__PURE__*/React.createElement("p", {
      className: "st-hero-lead"
    }, "sey.la | book brings verified local clients straight to your live calendar \u2014 with zero booking fees for them, and no phone tag for you."), /*#__PURE__*/React.createElement("form", {
      className: "st-hero-form",
      onSubmit: e => e.preventDefault()
    }, /*#__PURE__*/React.createElement(Input, {
      type: "email",
      placeholder: "Your studio email",
      "aria-label": "Studio email",
      containerStyle: {
        flex: 1
      }
    }), /*#__PURE__*/React.createElement(Button, {
      type: "submit",
      size: "md"
    }, "Create studio account")), /*#__PURE__*/React.createElement("div", {
      className: "st-hero-note"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 15,
      color: "var(--eucalyptus)"
    }), " Free to start \xB7 no card required \xB7 live the same day"), /*#__PURE__*/React.createElement("div", {
      className: "st-hero-badges"
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "brand"
    }, "0% client fees"), /*#__PURE__*/React.createElement(Badge, {
      tone: "botanical"
    }, "Real-time calendar"), /*#__PURE__*/React.createElement(Badge, {
      tone: "neutral"
    }, "You keep your clients"))), /*#__PURE__*/React.createElement("div", {
      className: "st-hero-panel lp-fade lp-fade--2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "st-panel"
    }, /*#__PURE__*/React.createElement("div", {
      className: "st-panel-head"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "st-panel-title"
    }, "Today \xB7 Kreol Spa"), /*#__PURE__*/React.createElement("div", {
      className: "st-panel-sub"
    }, "Beau Vallon, Mah\xE9")), /*#__PURE__*/React.createElement("span", {
      className: "st-panel-live"
    }, /*#__PURE__*/React.createElement("span", {
      className: "st-dot"
    }), " Live")), /*#__PURE__*/React.createElement("div", {
      className: "st-panel-stats"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "8"), /*#__PURE__*/React.createElement("span", null, "booked")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "3"), /*#__PURE__*/React.createElement("span", null, "open slots")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "\u20AC410"), /*#__PURE__*/React.createElement("span", null, "today"))), /*#__PURE__*/React.createElement("div", {
      className: "st-panel-list"
    }, /*#__PURE__*/React.createElement(BookingCard, {
      service: "Coconut & Frangipani massage",
      studio: "Aline \xB7 60 min",
      when: "14:30",
      price: "\u20AC55",
      status: "Confirmed",
      icon: "spa",
      style: {
        maxWidth: "none"
      }
    }), /*#__PURE__*/React.createElement(BookingCard, {
      service: "Signature facial",
      studio: "New client \xB7 45 min",
      when: "16:00",
      price: "\u20AC48",
      status: "New",
      icon: "sparkle",
      style: {
        maxWidth: "none"
      }
    }), /*#__PURE__*/React.createElement(BookingCard, {
      service: "Scalp ritual",
      studio: "Regular \xB7 30 min",
      when: "17:15",
      price: "\u20AC30",
      status: "Confirmed",
      icon: "lotus",
      style: {
        maxWidth: "none"
      }
    }))))));
  }
  window.StudiosHero = StudiosHero;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/studios/StudiosHero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/studios/StudiosNav.jsx
try { (() => {
// StudiosNav — B2B nav: logo, section links, "for clients", log in, primary CTA.
(function () {
  const {
    Logo,
    Button,
    Icon
  } = window.SeyLaBookDesignSystem_611419;
  function StudiosNav() {
    const [open, setOpen] = React.useState(false);
    return /*#__PURE__*/React.createElement("header", {
      className: "st-nav"
    }, /*#__PURE__*/React.createElement("div", {
      className: "st-nav-inner sey-container"
    }, /*#__PURE__*/React.createElement("div", {
      className: "st-nav-left"
    }, /*#__PURE__*/React.createElement(Logo, null), /*#__PURE__*/React.createElement("span", {
      className: "st-nav-tag"
    }, "for studios")), /*#__PURE__*/React.createElement("nav", {
      className: "st-nav-links",
      "aria-label": "Primary"
    }, /*#__PURE__*/React.createElement("a", {
      href: "#features"
    }, "Features"), /*#__PURE__*/React.createElement("a", {
      href: "#how"
    }, "How it works"), /*#__PURE__*/React.createElement("a", {
      href: "#pricing"
    }, "Pricing"), /*#__PURE__*/React.createElement("a", {
      className: "st-nav-clients",
      href: "/"
    }, "For clients \u2197"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm"
    }, "Log in"), /*#__PURE__*/React.createElement(Button, {
      size: "sm"
    }, "List your studio")), /*#__PURE__*/React.createElement("button", {
      className: "st-nav-burger",
      "aria-label": "Menu",
      "aria-expanded": open,
      onClick: () => setOpen(v => !v)
    }, /*#__PURE__*/React.createElement(Icon, {
      name: open ? "close" : "menu"
    }))), open && /*#__PURE__*/React.createElement("div", {
      className: "st-nav-mobile sey-container"
    }, /*#__PURE__*/React.createElement("a", {
      href: "#features",
      onClick: () => setOpen(false)
    }, "Features"), /*#__PURE__*/React.createElement("a", {
      href: "#how",
      onClick: () => setOpen(false)
    }, "How it works"), /*#__PURE__*/React.createElement("a", {
      href: "#pricing",
      onClick: () => setOpen(false)
    }, "Pricing"), /*#__PURE__*/React.createElement("a", {
      href: "/"
    }, "For clients \u2197"), /*#__PURE__*/React.createElement(Button, {
      full: true
    }, "List your studio")));
  }
  window.StudiosNav = StudiosNav;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/studios/StudiosNav.jsx", error: String((e && e.message) || e) }); }

// ui_kits/studios/StudiosOnboarding.jsx
try { (() => {
// StudiosOnboarding — 3-step "go live" flow on the dark cocoa band.
(function () {
  const {
    SectionHeader,
    StepCard,
    Icon
  } = window.SeyLaBookDesignSystem_611419;
  function StudiosOnboarding() {
    return /*#__PURE__*/React.createElement("section", {
      className: "st-section st-cocoa",
      id: "how"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sey-container"
    }, /*#__PURE__*/React.createElement(SectionHeader, {
      onDark: true,
      eyebrow: "Live in an afternoon",
      title: "From sign-up to first",
      accent: "booking.",
      intro: "No setup fees, no training. Most studios are taking bookings the same day."
    }), /*#__PURE__*/React.createElement("div", {
      className: "st-steps"
    }, /*#__PURE__*/React.createElement(StepCard, {
      step: "01",
      title: "Create your studio",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "pin"
      })
    }, "Add your name, location and a few photos. We verify you as a trusted local studio."), /*#__PURE__*/React.createElement(StepCard, {
      step: "02",
      title: "Add services & hours",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "calendar"
      })
    }, "List your treatments, prices and opening hours. Your live calendar builds itself."), /*#__PURE__*/React.createElement(StepCard, {
      step: "03",
      title: "Go live",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "check"
      })
    }, "Publish and start taking real-time bookings from clients across the islands."))));
  }
  window.StudiosOnboarding = StudiosOnboarding;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/studios/StudiosOnboarding.jsx", error: String((e && e.message) || e) }); }

// ui_kits/studios/StudiosProof.jsx
try { (() => {
// StudiosProof — stats + three diverse studio-owner testimonials on shell-alt.
(function () {
  const {
    Icon
  } = window.SeyLaBookDesignSystem_611419;
  const U = "https://images.unsplash.com/photo-";
  const QUOTES = [{
    quote: "The chairs used to sit empty between walk-ins. Now clients book the night before and my mornings run full — without a single phone call.",
    name: "Marcus R.",
    role: "Owner · Palm & Blade barbershop, Victoria",
    image: U + "1512864084360-7c0c4d0a0845"
  }, {
    quote: "Tourists find us the evening before their treatment and book in seconds. My calendar fills itself while I'm with a client.",
    name: "Aline D.",
    role: "Owner · Kreol Spa, Beau Vallon",
    image: U + "1519699047748-de8e457a634e"
  }, {
    quote: "Clients book their sessions and pay in the app. I just show up on the beach and coach — no chasing, no admin.",
    name: "Sasha M.",
    role: "Personal trainer · Anse Royale",
    image: U + "1632765854612-9b02b6ec2b15"
  }];
  function StudiosProof() {
    return /*#__PURE__*/React.createElement("section", {
      className: "st-section st-alt"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sey-container"
    }, /*#__PURE__*/React.createElement("div", {
      className: "st-stats"
    }, /*#__PURE__*/React.createElement("div", {
      className: "st-stat"
    }, /*#__PURE__*/React.createElement("b", null, "180+"), /*#__PURE__*/React.createElement("span", null, "island studios")), /*#__PURE__*/React.createElement("div", {
      className: "st-stat"
    }, /*#__PURE__*/React.createElement("b", null, "12k"), /*#__PURE__*/React.createElement("span", null, "bookings a month")), /*#__PURE__*/React.createElement("div", {
      className: "st-stat"
    }, /*#__PURE__*/React.createElement("b", null, "4.9"), /*#__PURE__*/React.createElement("span", null, "avg studio rating")), /*#__PURE__*/React.createElement("div", {
      className: "st-stat"
    }, /*#__PURE__*/React.createElement("b", null, "0%"), /*#__PURE__*/React.createElement("span", null, "client booking fees"))), /*#__PURE__*/React.createElement("div", {
      className: "st-testimonials"
    }, QUOTES.map(q => /*#__PURE__*/React.createElement("figure", {
      className: "st-tcard",
      key: q.name
    }, /*#__PURE__*/React.createElement("div", {
      className: "st-quote-rating",
      "aria-label": "5 out of 5"
    }, [0, 1, 2, 3, 4].map(i => /*#__PURE__*/React.createElement(Icon, {
      key: i,
      name: "star",
      size: 15,
      color: "var(--brass)"
    }))), /*#__PURE__*/React.createElement("blockquote", null, q.quote), /*#__PURE__*/React.createElement("figcaption", {
      className: "st-tcard-by"
    }, /*#__PURE__*/React.createElement("img", {
      className: "st-tcard-avatar",
      src: q.image + "?auto=format&fit=crop&w=120&h=120&q=70",
      alt: "",
      loading: "lazy"
    }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
      className: "st-quote-name"
    }, q.name), /*#__PURE__*/React.createElement("span", {
      className: "st-quote-role"
    }, q.role))))))));
  }
  window.StudiosProof = StudiosProof;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/studios/StudiosProof.jsx", error: String((e && e.message) || e) }); }

// ui_kits/studios/StudiosValue.jsx
try { (() => {
// StudiosValue — the core value props for studios.
(function () {
  const {
    SectionHeader,
    Icon
  } = window.SeyLaBookDesignSystem_611419;
  const VALUES = [{
    icon: "clock",
    title: "A calendar that fills itself",
    body: "Your real availability, live. Clients book open slots in seconds — no calls, no double-bookings, no back-and-forth."
  }, {
    icon: "heart",
    title: "No commission on your clients",
    body: "Booking is always free for them and there's no cut of your service price. You set your rates, you keep them."
  }, {
    icon: "pin",
    title: "Verified local visibility",
    body: "Get featured to tourists and residents across Mahé, Praslin and La Digue — whether you run a spa, barbershop, nail bar, tattoo studio or train clients one-to-one."
  }, {
    icon: "shield",
    title: "Fewer no-shows",
    body: "Automatic reminders and cancellations locked 12 hours before the visit keep your chairs full and your day calm."
  }];
  function StudiosValue() {
    return /*#__PURE__*/React.createElement("section", {
      className: "st-section",
      id: "features"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sey-container"
    }, /*#__PURE__*/React.createElement(SectionHeader, {
      eyebrow: "Why studios choose sey.la",
      title: "Everything you need to stay",
      accent: "booked.",
      intro: "Built for island salons, barbers, spas and studios \u2014 the calm way to run a full calendar."
    }), /*#__PURE__*/React.createElement("div", {
      className: "st-values"
    }, VALUES.map(v => /*#__PURE__*/React.createElement("article", {
      className: "st-value",
      key: v.title
    }, /*#__PURE__*/React.createElement("span", {
      className: "st-value-icon"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: v.icon,
      size: 24
    })), /*#__PURE__*/React.createElement("h3", null, v.title), /*#__PURE__*/React.createElement("p", null, v.body))))));
  }
  window.StudiosValue = StudiosValue;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/studios/StudiosValue.jsx", error: String((e && e.message) || e) }); }

// ui_kits/venue/VenueClose.jsx
try { (() => {
// VenueClose — reviews, visit info (hours + map), booking CTA, powered-by footer.
(function () {
  const {
    Button,
    Icon
  } = window.SeyLaBookDesignSystem_611419;
  const U = "https://images.unsplash.com/photo-";
  const REVIEWS = [{
    name: "Sofia",
    when: "2 days ago",
    img: U + "1632765866070-3fadf25d3d5b",
    text: "The frangipani massage was the highlight of our trip. Booked the night before and everything was ready."
  }, {
    name: "James",
    when: "1 week ago",
    img: U + "1699641975121-5c3f55a553e5",
    text: "Deep-tissue with Denis sorted out my surfing shoulders. Calm room, warm welcome."
  }, {
    name: "Nadia",
    when: "2 weeks ago",
    img: U + "1713845784497-fe3d7ed176d8",
    text: "A proper island spa. Tea after the facial, no rushing. I'll be back before I fly home."
  }];
  const HOURS = [["Mon – Fri", "9:00 – 19:00"], ["Saturday", "9:00 – 17:00"], ["Sunday", "10:00 – 15:00"]];
  function VenueClose() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("section", {
      className: "vn-section",
      id: "reviews"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sey-container"
    }, /*#__PURE__*/React.createElement("div", {
      className: "vn-reviews-head"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "sey-eyebrow vn-eyebrow"
    }, "Loved by guests"), /*#__PURE__*/React.createElement("h2", {
      className: "vn-sec-title"
    }, "What people ", /*#__PURE__*/React.createElement("em", {
      className: "sey-accent-italic"
    }, "say."))), /*#__PURE__*/React.createElement("div", {
      className: "vn-score"
    }, /*#__PURE__*/React.createElement("span", {
      className: "vn-score-num"
    }, "4.9"), /*#__PURE__*/React.createElement("span", {
      className: "vn-score-stars"
    }, [0, 1, 2, 3, 4].map(i => /*#__PURE__*/React.createElement(Icon, {
      key: i,
      name: "star",
      size: 16,
      color: "var(--brass)"
    }))), /*#__PURE__*/React.createElement("span", {
      className: "vn-score-count"
    }, "214 reviews"))), /*#__PURE__*/React.createElement("div", {
      className: "vn-reviews"
    }, REVIEWS.map(r => /*#__PURE__*/React.createElement("figure", {
      className: "vn-review",
      key: r.name
    }, /*#__PURE__*/React.createElement("div", {
      className: "vn-quote-rating"
    }, [0, 1, 2, 3, 4].map(i => /*#__PURE__*/React.createElement(Icon, {
      key: i,
      name: "star",
      size: 14,
      color: "var(--brass)"
    }))), /*#__PURE__*/React.createElement("blockquote", null, r.text), /*#__PURE__*/React.createElement("figcaption", {
      className: "vn-review-by"
    }, /*#__PURE__*/React.createElement("img", {
      src: r.img + "?auto=format&fit=crop&w=100&h=100&q=70",
      alt: "",
      loading: "lazy"
    }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
      className: "vn-member-name"
    }, r.name), /*#__PURE__*/React.createElement("span", {
      className: "vn-member-role"
    }, r.when)))))))), /*#__PURE__*/React.createElement("section", {
      className: "vn-section vn-alt",
      id: "visit"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sey-container vn-visit"
    }, /*#__PURE__*/React.createElement("div", {
      className: "vn-visit-info"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sey-eyebrow vn-eyebrow"
    }, "Visit us"), /*#__PURE__*/React.createElement("h2", {
      className: "vn-sec-title"
    }, "Beau Vallon, ", /*#__PURE__*/React.createElement("em", {
      className: "sey-accent-italic"
    }, "Mah\xE9.")), /*#__PURE__*/React.createElement("p", {
      className: "vn-address"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "pin",
      size: 18,
      color: "var(--clay)"
    }), " Beach Road, Beau Vallon, Mah\xE9, Seychelles"), /*#__PURE__*/React.createElement("table", {
      className: "vn-hours"
    }, /*#__PURE__*/React.createElement("tbody", null, HOURS.map(([d, h]) => /*#__PURE__*/React.createElement("tr", {
      key: d
    }, /*#__PURE__*/React.createElement("th", null, d), /*#__PURE__*/React.createElement("td", null, h))))), /*#__PURE__*/React.createElement(Button, {
      size: "lg",
      href: "#services",
      as: "a"
    }, "Book a treatment")), /*#__PURE__*/React.createElement("div", {
      className: "vn-map",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("span", {
      className: "vn-map-pin"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "pin",
      size: 20,
      color: "var(--surface)"
    })), /*#__PURE__*/React.createElement("span", {
      className: "vn-map-label"
    }, "Beau Vallon Bay")))), /*#__PURE__*/React.createElement("footer", {
      className: "vn-footer"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sey-container vn-footer-inner"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "vn-brand vn-brand--foot"
    }, /*#__PURE__*/React.createElement("span", {
      className: "vn-brand-mark"
    }, "Kreol"), /*#__PURE__*/React.createElement("span", {
      className: "vn-brand-word"
    }, "Spa")), /*#__PURE__*/React.createElement("p", null, "Beach Road, Beau Vallon \xB7 +248 4 000 000 \xB7 hello@kreolspa.sc")), /*#__PURE__*/React.createElement("a", {
      className: "vn-powered",
      href: "/"
    }, "Bookings powered by ", /*#__PURE__*/React.createElement("b", null, "sey.la\xA0|\xA0book")))));
  }
  window.VenueClose = VenueClose;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/venue/VenueClose.jsx", error: String((e && e.message) || e) }); }

// ui_kits/venue/VenueHero.jsx
try { (() => {
// VenueHero — the studio's own header + full-bleed cover hero.
(function () {
  const {
    Button,
    Icon
  } = window.SeyLaBookDesignSystem_611419;
  const U = "https://images.unsplash.com/photo-";
  function VenueHero() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("header", {
      className: "vn-topbar"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sey-container vn-topbar-inner"
    }, /*#__PURE__*/React.createElement("a", {
      className: "vn-brand",
      href: "#top"
    }, /*#__PURE__*/React.createElement("span", {
      className: "vn-brand-mark"
    }, "Kreol"), /*#__PURE__*/React.createElement("span", {
      className: "vn-brand-word"
    }, "Spa")), /*#__PURE__*/React.createElement("nav", {
      className: "vn-nav",
      "aria-label": "Sections"
    }, /*#__PURE__*/React.createElement("a", {
      href: "#services"
    }, "Services"), /*#__PURE__*/React.createElement("a", {
      href: "#classes"
    }, "Classes"), /*#__PURE__*/React.createElement("a", {
      href: "#team"
    }, "Team"), /*#__PURE__*/React.createElement("a", {
      href: "#gallery"
    }, "Gallery"), /*#__PURE__*/React.createElement("a", {
      href: "#reviews"
    }, "Reviews"), /*#__PURE__*/React.createElement("a", {
      href: "#visit"
    }, "Visit")), /*#__PURE__*/React.createElement("div", {
      className: "vn-topbar-cta"
    }, /*#__PURE__*/React.createElement("a", {
      className: "vn-call",
      href: "#visit"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "pin",
      size: 16,
      color: "var(--clay)"
    }), " Beau Vallon"), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      href: "#services",
      as: "a"
    }, "Book now")))), /*#__PURE__*/React.createElement("section", {
      className: "vn-hero",
      id: "top"
    }, /*#__PURE__*/React.createElement("div", {
      className: "vn-hero-media",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("img", {
      src: U + "1696841212541-449ca29397cc?auto=format&fit=crop&w=1600&q=75",
      alt: ""
    }), /*#__PURE__*/React.createElement("div", {
      className: "vn-hero-scrim"
    })), /*#__PURE__*/React.createElement("div", {
      className: "sey-container vn-hero-inner"
    }, /*#__PURE__*/React.createElement("div", {
      className: "vn-hero-eyebrow"
    }, "Spa & massage \xB7 Beau Vallon, Mah\xE9"), /*#__PURE__*/React.createElement("h1", {
      className: "vn-hero-title"
    }, "Kreol ", /*#__PURE__*/React.createElement("em", {
      className: "sey-accent-italic"
    }, "Spa")), /*#__PURE__*/React.createElement("p", {
      className: "vn-hero-lead"
    }, "A quiet island ritual a few steps from the sand \u2014 warm oils, frangipani, and slow hands. Book a table in seconds."), /*#__PURE__*/React.createElement("div", {
      className: "vn-hero-meta"
    }, /*#__PURE__*/React.createElement("span", {
      className: "vn-meta-pill"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "star",
      size: 15,
      color: "var(--brass)"
    }), " ", /*#__PURE__*/React.createElement("b", null, "4.9"), " \xB7 214 reviews"), /*#__PURE__*/React.createElement("span", {
      className: "vn-meta-pill vn-open"
    }, /*#__PURE__*/React.createElement("span", {
      className: "vn-dot"
    }), " Open until 19:00"), /*#__PURE__*/React.createElement("span", {
      className: "vn-meta-pill"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "heart",
      size: 14,
      color: "var(--clay)"
    }), " Free to book")), /*#__PURE__*/React.createElement("div", {
      className: "vn-hero-actions"
    }, /*#__PURE__*/React.createElement(Button, {
      size: "lg",
      href: "#services",
      as: "a"
    }, "Book a treatment"), /*#__PURE__*/React.createElement(Button, {
      size: "lg",
      variant: "secondary",
      href: "#visit",
      as: "a"
    }, "Get directions")))));
  }
  window.VenueHero = VenueHero;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/venue/VenueHero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/venue/VenueServices.jsx
try { (() => {
// VenueServices — the core: grouped treatment menu with prices + book buttons.
(function () {
  const {
    Button,
    Icon,
    Badge
  } = window.SeyLaBookDesignSystem_611419;
  const GROUPS = [{
    name: "Massage",
    items: [{
      name: "Coconut & Frangipani signature",
      desc: "Warm oil full-body massage with island botanicals.",
      dur: "60 min",
      price: "€55",
      tag: "Most booked"
    }, {
      name: "Deep-tissue recovery",
      desc: "Firmer pressure for shoulders, back and legs.",
      dur: "60 min",
      price: "€58"
    }, {
      name: "Hot stone therapy",
      desc: "Volcanic stones to melt deep tension.",
      dur: "75 min",
      price: "€65"
    }]
  }, {
    name: "Face",
    items: [{
      name: "Signature island facial",
      desc: "Cleanse, clay mask and lymphatic massage.",
      dur: "50 min",
      price: "€48"
    }, {
      name: "Express glow facial",
      desc: "A quick reset before dinner.",
      dur: "30 min",
      price: "€32"
    }]
  }, {
    name: "Body & rituals",
    items: [{
      name: "Sea salt & clay body wrap",
      desc: "Exfoliate, wrap and hydrate.",
      dur: "60 min",
      price: "€52"
    }, {
      name: "Couples' frangipani ritual",
      desc: "Side-by-side massage for two.",
      dur: "60 min",
      price: "€105",
      tag: "For two"
    }]
  }];
  function VenueServices() {
    const [active, setActive] = React.useState(GROUPS[0].name);
    const group = GROUPS.find(g => g.name === active);
    return /*#__PURE__*/React.createElement("section", {
      className: "vn-section",
      id: "services"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sey-container"
    }, /*#__PURE__*/React.createElement("div", {
      className: "vn-sec-head"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "sey-eyebrow vn-eyebrow"
    }, "The menu"), /*#__PURE__*/React.createElement("h2", {
      className: "vn-sec-title"
    }, "Choose your ", /*#__PURE__*/React.createElement("em", {
      className: "sey-accent-italic"
    }, "treatment"))), /*#__PURE__*/React.createElement("div", {
      className: "vn-tabs",
      role: "tablist",
      "aria-label": "Service groups"
    }, GROUPS.map(g => /*#__PURE__*/React.createElement("button", {
      key: g.name,
      role: "tab",
      "aria-selected": active === g.name,
      className: "vn-tab" + (active === g.name ? " is-active" : ""),
      onClick: () => setActive(g.name)
    }, g.name)))), /*#__PURE__*/React.createElement("ul", {
      className: "vn-menu"
    }, group.items.map(s => /*#__PURE__*/React.createElement("li", {
      className: "vn-srv",
      key: s.name
    }, /*#__PURE__*/React.createElement("div", {
      className: "vn-srv-main"
    }, /*#__PURE__*/React.createElement("div", {
      className: "vn-srv-top"
    }, /*#__PURE__*/React.createElement("h3", null, s.name), s.tag && /*#__PURE__*/React.createElement(Badge, {
      tone: "brand"
    }, s.tag)), /*#__PURE__*/React.createElement("p", null, s.desc), /*#__PURE__*/React.createElement("span", {
      className: "vn-srv-dur"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "clock",
      size: 14,
      color: "var(--cocoa-40)"
    }), " ", s.dur)), /*#__PURE__*/React.createElement("div", {
      className: "vn-srv-end"
    }, /*#__PURE__*/React.createElement("span", {
      className: "vn-srv-price"
    }, s.price), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "secondary"
    }, "Book")))))));
  }
  window.VenueServices = VenueServices;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/venue/VenueServices.jsx", error: String((e && e.message) || e) }); }

// ui_kits/venue/VenueShowcase.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// VenueShowcase — about strip, the team, and a photo gallery.
(function () {
  const {
    Icon,
    ClassCard
  } = window.SeyLaBookDesignSystem_611419;
  const U = "https://images.unsplash.com/photo-";
  const CLASSES = [{
    day: "Mon",
    time: "07:00",
    name: "Sunrise beach yoga",
    instructor: "with Aline",
    duration: "60 min",
    level: "All levels",
    price: "\u20ac18",
    spotsLeft: 6,
    capacity: 14
  }, {
    day: "Wed",
    time: "18:00",
    name: "Candlelight yin",
    instructor: "with Marie",
    duration: "75 min",
    level: "Gentle",
    price: "\u20ac20",
    spotsLeft: 2,
    capacity: 10
  }, {
    day: "Sat",
    time: "08:00",
    name: "Personal training \u00b7 small group",
    instructor: "with Denis",
    duration: "45 min",
    level: "Intermediate",
    price: "\u20ac25",
    spotsLeft: 0,
    capacity: 6
  }, {
    day: "Sun",
    time: "09:00",
    name: "Flow & breath",
    instructor: "with Aline",
    duration: "60 min",
    level: "All levels",
    price: "\u20ac18",
    spotsLeft: 9,
    capacity: 14
  }];
  const TEAM = [{
    name: "Aline",
    role: "Founder · Massage therapist",
    img: U + "1519699047748-de8e457a634e"
  }, {
    name: "Marie",
    role: "Facialist",
    img: U + "1632765854612-9b02b6ec2b15"
  }, {
    name: "Denis",
    role: "Deep-tissue & sports",
    img: U + "1512864084360-7c0c4d0a0845"
  }];
  const GALLERY = [U + "1540555700478-4be289fbecef", U + "1620733723572-11c53f73a416", U + "1544161515-4ab6ce6db874", U + "1600334089648-b0d9d3028eb2", U + "1616394584738-fc6e612e71b9", U + "1519823551278-64ac92734fb1"];
  const AMENITIES = [{
    icon: "pin",
    label: "2 min from the beach"
  }, {
    icon: "heart",
    label: "Couples' room"
  }, {
    icon: "sparkle",
    label: "Frangipani tea served"
  }, {
    icon: "check",
    label: "Free parking"
  }];
  function VenueShowcase() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("section", {
      className: "vn-section vn-alt",
      id: "about"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sey-container vn-about"
    }, /*#__PURE__*/React.createElement("div", {
      className: "vn-about-copy"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sey-eyebrow vn-eyebrow"
    }, "The place"), /*#__PURE__*/React.createElement("h2", {
      className: "vn-sec-title"
    }, "Made for slowing ", /*#__PURE__*/React.createElement("em", {
      className: "sey-accent-italic"
    }, "down.")), /*#__PURE__*/React.createElement("p", null, "Tucked behind the takamaka trees at Beau Vallon, Kreol Spa is a small team of island therapists. We work with warm coconut oil, local clay and frangipani \u2014 and never rush a treatment."), /*#__PURE__*/React.createElement("ul", {
      className: "vn-amenities"
    }, AMENITIES.map(a => /*#__PURE__*/React.createElement("li", {
      key: a.label
    }, /*#__PURE__*/React.createElement(Icon, {
      name: a.icon,
      size: 17,
      color: "var(--eucalyptus)"
    }), " ", a.label)))), /*#__PURE__*/React.createElement("div", {
      className: "vn-about-photo"
    }, /*#__PURE__*/React.createElement("img", {
      src: U + "1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=720&q=75",
      alt: "Inside Kreol Spa",
      loading: "lazy"
    })))), /*#__PURE__*/React.createElement("section", {
      className: "vn-section",
      id: "team"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sey-container"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sey-eyebrow vn-eyebrow"
    }, "Your therapists"), /*#__PURE__*/React.createElement("h2", {
      className: "vn-sec-title"
    }, "The ", /*#__PURE__*/React.createElement("em", {
      className: "sey-accent-italic"
    }, "hands.")), /*#__PURE__*/React.createElement("div", {
      className: "vn-team"
    }, TEAM.map(t => /*#__PURE__*/React.createElement("figure", {
      className: "vn-member",
      key: t.name
    }, /*#__PURE__*/React.createElement("img", {
      src: t.img + "?auto=format&fit=crop&w=400&h=460&q=72",
      alt: t.name,
      loading: "lazy"
    }), /*#__PURE__*/React.createElement("figcaption", null, /*#__PURE__*/React.createElement("span", {
      className: "vn-member-name"
    }, t.name), /*#__PURE__*/React.createElement("span", {
      className: "vn-member-role"
    }, t.role))))))), /*#__PURE__*/React.createElement("section", {
      className: "vn-section",
      id: "classes"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sey-container"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sey-eyebrow vn-eyebrow"
    }, "Book a spot"), /*#__PURE__*/React.createElement("h2", {
      className: "vn-sec-title"
    }, "Group ", /*#__PURE__*/React.createElement("em", {
      className: "sey-accent-italic"
    }, "classes.")), /*#__PURE__*/React.createElement("p", {
      className: "vn-classes-intro"
    }, "Yoga and movement on the sand, plus small-group training. Spots are limited \\u2014 grab yours before they fill."), /*#__PURE__*/React.createElement("div", {
      className: "vn-classes"
    }, ClassCard && CLASSES.map((c, i) => /*#__PURE__*/React.createElement(ClassCard, _extends({
      key: i
    }, c)))))), /*#__PURE__*/React.createElement("section", {
      className: "vn-section vn-alt",
      id: "gallery"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sey-container"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sey-eyebrow vn-eyebrow"
    }, "Inside the spa"), /*#__PURE__*/React.createElement("h2", {
      className: "vn-sec-title"
    }, "A look ", /*#__PURE__*/React.createElement("em", {
      className: "sey-accent-italic"
    }, "around.")), /*#__PURE__*/React.createElement("div", {
      className: "vn-gallery"
    }, GALLERY.map((g, i) => /*#__PURE__*/React.createElement("figure", {
      className: "vn-gcell vn-gcell--" + i,
      key: i
    }, /*#__PURE__*/React.createElement("img", {
      src: g + "?auto=format&fit=crop&w=600&q=72",
      alt: "",
      loading: "lazy"
    })))))));
  }
  window.VenueShowcase = VenueShowcase;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/venue/VenueShowcase.jsx", error: String((e && e.message) || e) }); }

__ds_ns.BookingCard = __ds_scope.BookingCard;

__ds_ns.CategoryTile = __ds_scope.CategoryTile;

__ds_ns.ClassCard = __ds_scope.ClassCard;

__ds_ns.SearchBar = __ds_scope.SearchBar;

__ds_ns.StepCard = __ds_scope.StepCard;

__ds_ns.StudioCard = __ds_scope.StudioCard;

__ds_ns.TrustPoint = __ds_scope.TrustPoint;

__ds_ns.ArchMirror = __ds_scope.ArchMirror;

__ds_ns.FamilySwitcher = __ds_scope.FamilySwitcher;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.ICON_NAMES = __ds_scope.ICON_NAMES;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.SectionHeader = __ds_scope.SectionHeader;

})();
