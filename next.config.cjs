/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: true, // Enable React Compiler for React 19
  },
  // Remove any webpack config related to React compiler runtime
  webpack: (config, { isServer }) => {
    // Ignore critical dependency warnings from prettier
    config.ignoreWarnings = [/Critical dependency: the request of a dependency is an expression/];
    return config;
  },
};

module.exports = nextConfig;
