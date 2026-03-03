/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for Docker standalone deployment
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "backend.cvg.construction",
      },
      // Legacy hostname kept for backwards compatibility
      {
        protocol: "https",
        hostname: "cvg.pnehomes.com",
      },
    ],
  },
};

module.exports = nextConfig;
