/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export so the frontend can be deployed on Vercel, Netlify,
  // GitHub Pages, S3, or any static host with no Node server required.
  output: "export",

  // Static export cannot use the Next.js Image Optimization server,
  // so images are served as-is from /public.
  images: {
    unoptimized: true,
  },

  // Emit /about/index.html instead of /about.html — nicer static routing.
  trailingSlash: true,

  reactStrictMode: true,
};

export default nextConfig;
