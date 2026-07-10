/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }] },
  // Legacy static-mockup URLs (the original prototype shipped /studios/index.html,
  // /landing/index.html, etc.). Anything still pointing at them — old bookmarks,
  // cached pages, printed QR codes, previously-sent links — is redirected to the
  // real App Router routes so it never 404s.
  async redirects() {
    const map = [
      ["/studios/index.html", "/for-studios"],
      ["/studios", "/for-studios"],
      ["/landing/index.html", "/"],
      ["/landing", "/"],
      ["/venue/index.html", "/search"],
      ["/venue", "/search"],
      ["/search/index.html", "/search"],
      ["/pages/about.html", "/about"],
      ["/pages/contact.html", "/contact"],
    ];
    return map.map(([source, destination]) => ({ source, destination, permanent: true }));
  },
};
export default nextConfig;
