import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d2O9jisil73ccf.cloudfront.net", // CloudFront CDN
      },
      {
        protocol: "https",
        hostname: "d209jjsil73ccf.cloudfront.net", // CloudFront CDN
      },
      {
        protocol: "https",
        hostname: "roopshree.s3.ap-south-1.amazonaws.com", // S3 Bucket fallback
      },
    ],
  },
};

export default nextConfig;