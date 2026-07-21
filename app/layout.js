import "./globals.css";
export const metadata={title:"sey.la | book",description:"Book beauty & wellness across the Seychelles."};
export default function RootLayout({children}){return(<html lang="en"><head><link rel="preconnect" href="https://fonts.googleapis.com"/><link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>{/* Leaflet stylesheet, always present so the map is styled the moment it mounts.
      The Leaflet script itself is injected by StudioMap (a manually-appended
      <script> is reliably executed; a React-rendered one would not be). */}<link rel="stylesheet" href="/vendor/leaflet/leaflet.css"/></head><body>{children}</body></html>);}
