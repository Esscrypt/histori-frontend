const withMDX = require("@next/mdx")();

console.log("NODE_ENV is:", process.env.NODE_ENV);

const isProduction = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: isProduction && "export" || "standalone", // Use `export` in production and `public` in development
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
