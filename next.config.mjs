/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  webpack(config) {
    config.resolve.modules.push(new URL('./src', import.meta.url).pathname)
    return config
  },
}

export default nextConfig
