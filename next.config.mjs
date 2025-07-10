/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.resolve.modules.push(new URL('./src', import.meta.url).pathname);
    return config;
  },
};

export default nextConfig;
