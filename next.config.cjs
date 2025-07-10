/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: true, // Enable React Compiler for React 19
  },
  // Remove any webpack config related to React compiler runtime
}

module.exports = nextConfig
