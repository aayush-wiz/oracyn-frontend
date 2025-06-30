/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  // --- ADD THIS BLOCK TO IGNORE ERRORS ---
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  // ------------------------------------

  reactStrictMode: true,
};

export default nextConfig;
