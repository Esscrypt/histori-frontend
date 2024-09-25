const withMDX = require("@next/mdx")();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // basePath: '/', // Optional, but required if you're deploying to a non-root path.
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  // Optionally, add any other Next.js config below
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
};

module.exports = withMDX(nextConfig);
