/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uploadthing.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "subdomain",
        port: "",
      },
      {
        protocol: "https",
        hostname: "files.stripe.com",
        port: "",
      },
    ],
  },
  reactStrictMode: false,
};

module.exports = nextConfig;
