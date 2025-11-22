import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.pinata.cloud',
      },
      {
        protocol: 'https',
        hostname: 'gateway.pinata.cloud',
      },
      {
        protocol: 'https',
        hostname: '**.mypinata.cloud',
      },
      {
        protocol: 'https',
        hostname: 'ipfs.io',
      },
      {
        protocol: 'https',
        hostname: 'dweb.link',
      },
      {
        protocol: 'https',
        hostname: 'cloudflare-ipfs.com',
      },
      {
        protocol: 'https',
        hostname: 'trustless-gateway.link',
      },
      {
        protocol: 'https',
        hostname: 'ipfs.filebase.io',
      },
    ],
  },
  turbopack: {},
  webpack: (config, { isServer, webpack }) => {
    // Base app required externals
    config.externals.push("pino-pretty", "lokijs", "encoding");

    // Fixes for wagmi/WalletConnect dependencies
    if (!isServer) {
      // Provide fallbacks for Node.js modules in the browser
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        path: false,
        os: false,
        util: false,
        buffer: false,
        events: false,
      }
    }

    // Ignore problematic modules and test files
    config.resolve.alias = {
      ...config.resolve.alias,
      'why-is-node-running': false,
      'pino-pretty': false,
    }

    // Ignore specific problematic imports
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /pino-pretty/,
      })
    )

    // Replace the problematic test helper file with empty module
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /thread-stream\/test\/helper\.js/,
        path.resolve(__dirname, 'webpack-empty-module.js')
      )
    )

    return config
  },
}

export default nextConfig
