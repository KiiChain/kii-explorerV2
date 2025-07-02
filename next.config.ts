import type { Configuration } from "webpack";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.kiichain.io",
      },
      {
        protocol: "https",
        hostname: "**.kiprotocol.com",
      },
      {
        protocol: "https",
        hostname: "www.google.com",
      },
    ],
  },
  webpack(config: Configuration) {
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];

    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            typescript: true,
            icon: true,
          },
        },
      ],
    });

    return config;
  },
  async redirects() {
    return [
      {
        source: "/tx/:hash",
        destination: "/transaction/:hash",
        permanent: true,
      },
      {
        source: "/address/:hash",
        destination: "/account/:hash",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
