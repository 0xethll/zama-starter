import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { webpack }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    }
    config.plugins.push(
      new webpack.DefinePlugin({
        global: 'globalThis',
      }),
    )
    return config
  },
  async headers() {
    return [
      {
        // Apply COEP credentialless to all pages - works with iframes and FHE
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'credentialless',
          },
        ],
      },
    ]
  },
}

export default nextConfig
