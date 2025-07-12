/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: true, // React Compiler for React 19
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/media/file/**',
      },
    ],
  },
  webpack(config) {
    // Allow absolute imports from ./src
    config.resolve.modules.push(new URL('./src', import.meta.url).pathname)

    // Suppress Prettier dynamic import warning
    config.module.exprContextCritical = false

    // Ignore "Critical dependency: the request of a dependency is an expression" warnings
    config.ignoreWarnings = [/Critical dependency: the request of a dependency is an expression/]

    return config
  },
}

export default nextConfig
