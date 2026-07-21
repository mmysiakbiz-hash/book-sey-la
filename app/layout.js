import "./globals.css";
export const metadata={title:"sey.la | book",description:"Book beauty & wellness across the Seychelles."};
export default function RootLayout({children}){return(<html lang="en"><head><link rel="preconnect" href="https://fonts.googleapis.com"/><link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>{/* Self-hosted Leaflet, loaded in the real server-rendered <head> so the browser
      actually executes it and sets window.L (a React-injected <script> is NOT
      executed). Powers the interactive studio map. */}<link rel="stylesheet" href="/vendor/leaflet/leaflet.css"/><script src="/vendor/leaflet/leaflet.js" defer></script></head><body>{children}</body></html>);}
