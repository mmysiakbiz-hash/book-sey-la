/** @type {import('next').NextConfig} */
// NOTE: webpack persistent cache disabled — Vercel was serving a stale compiled
// FeaturedStudios/SearchPage (old demo studios) even after source edits. Forcing a
// full recompile each build guarantees the deployed output matches source.
const nextConfig = {
  images: { remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }] },
  webpack: (config) => {
    config.cache = false;
    return config;
  },
};
export default nextConfig;
