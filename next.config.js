/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		// allow loading images from the backend host used in API responses
		domains: ["cvg.pnehomes.com"],
		// if you later need more flexible matching, use `remotePatterns`
	},
};

module.exports = nextConfig;
