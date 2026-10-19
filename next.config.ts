import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
        condition: {
          all: [{path: '*.svg'}, {not: {path: /url/}}],
        },
      },
      '*.mp3': {
        type: 'asset',
      },
    },
  },
};

export default nextConfig;
