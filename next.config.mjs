/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // static HTML in /out — no server needed
  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
};
export default nextConfig;
