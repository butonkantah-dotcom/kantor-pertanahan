/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};
const path = require("path");
/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    outputFileTracingRoot: path.join(__dirname), // kunci root ke folder proyek
  },
};

export default nextConfig;
