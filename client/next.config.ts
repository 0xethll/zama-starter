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
}

export default nextConfig
