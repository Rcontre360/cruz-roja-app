/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  basePath: "/cruz-roja",
  async redirects() {
    return [
      {
        source: '/',
        destination: '/cruz-roja',
        basePath: false,
        permanent: false
      }
    ]
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.justboil.me',
      },
    ],
  },
}

export default nextConfig
