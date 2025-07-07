import { withPayload } from '@payloadcms/next/withPayload'

import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined || process.env.__NEXT_PRIVATE_ORIGIN || 'http://localhost:3000'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL /* 'https://example.com' */].map((item) => {
        const url = new URL(item)

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', ''),
        }
      }),
    ],
  },
  webpack: (config, { isServer }) => {
    // Suppress the warning for prettier
    config.ignoreWarnings = [
      {
        module: /node_modules\/prettier\/index\.mjs$/,
        message: /Critical dependency: the request of a dependency is an expression/,
      },
    ]

    config.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    // Add fallback for Node.js modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    }

    // Handle Sharp for Vercel deployment
    if (process.env.NODE_ENV === 'production') {
      config.externals = config.externals || []
      config.externals.push('sharp')
    }

    // Configure Sass loader to suppress deprecation warnings
    config.module.rules.forEach((rule) => {
      if (rule.oneOf) {
        rule.oneOf.forEach((oneOfRule) => {
          if (oneOfRule.use && Array.isArray(oneOfRule.use)) {
            oneOfRule.use.forEach((useItem) => {
              if (useItem.loader && useItem.loader.includes('sass-loader')) {
                useItem.options = {
                  ...useItem.options,
                  sassOptions: {
                    ...useItem.options?.sassOptions,
                    quietDeps: true, // Suppress deprecation warnings from dependencies
                  },
                }
              }
            })
          }
        })
      }
    })

    return config
  },
  reactStrictMode: true,
  redirects,
  // Use the new serverExternalPackages instead of the deprecated experimental.serverComponentsExternalPackages
  serverExternalPackages: ['payload'],
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
