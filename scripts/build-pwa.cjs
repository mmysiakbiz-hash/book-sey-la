#!/usr/bin/env node
/* Transpile the PWA app: public/pwa/App.jsx -> public/pwa/App.js
   (classic React.createElement runtime, so it runs with the self-hosted React UMD
   under a strict CSP — no in-browser Babel). Run after editing App.jsx:

     npm run build:pwa

   Requires the dev deps @babel/core and @babel/preset-react. */
const babel = require("@babel/core");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const inFile = path.join(root, "public/pwa/App.jsx");
const outFile = path.join(root, "public/pwa/App.js");
const HEADER = "/* sey.la | book PWA — compiled from App.jsx (do not edit; edit App.jsx and re-transpile with @babel/preset-react classic runtime). */";

const src = fs.readFileSync(inFile, "utf8");
const out = babel.transformSync(src, {
  configFile: false,
  babelrc: false,
  presets: [[require("@babel/preset-react"), { runtime: "classic", pure: true }]],
  comments: true,
  compact: false,
});
fs.writeFileSync(outFile, HEADER + "\n" + out.code);
console.log("build-pwa: wrote public/pwa/App.js (" + out.code.length + " bytes)");
