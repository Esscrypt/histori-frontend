const withMDX = require("@next/mdx")();

console.log("NODE_ENV is:", process.env.NODE_ENV);

const isProduction = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
let nextConfig = {
  // output: isProduction && "export" || "standalone", // Use `export` in production and `public` in development
  // basePath: '/', // Optional, but required if you're deploying to a non-root path.
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  // Optionally, add any other Next.js config below
  reactStrictMode: true,
  env: {
    HST_TOKEN_ADDRESS: process.env.HST_TOKEN_ADDRESS,
    DEPOSIT_ADDRESS: process.env.DEPOSIT_ADDRESS,
    ENV: process.env.ENV,
  }
  // images: {
  //   unoptimized: true,
  // },
};
 if (isProduction) {
  nextConfig = {
    ...nextConfig,
    output: "export",
    images: {
      unoptimized: true,
    }, 
  }
 }

module.exports = withMDX(nextConfig);
