import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static-cdn.jtvnw.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'clips-media-assets2.twitch.tv',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'vod-secure.twitch.tv',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'clips-media-assets.twitch.tv',
        port: '',
        pathname: '/**',
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
