/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/fevereducation' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/fevereducation/' : '',
  trailingSlash: true,
}

export default nextConfig
