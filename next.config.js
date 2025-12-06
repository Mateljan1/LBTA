/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qtrypzzcjebvfcihiynt.supabase.co',
      },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  poweredByHeader: false,
  async redirects() {
    return [
      // Fitness & Conditioning redirects
      {
        source: '/strength-conditioning',
        destination: '/fitness',
        permanent: true,
      },
      {
        source: '/strength-conditioning/',
        destination: '/fitness',
        permanent: true,
      },
      {
        source: '/fitness-programs',
        destination: '/fitness',
        permanent: true,
      },
      {
        source: '/fitness-programs/',
        destination: '/fitness',
        permanent: true,
      },
      // Pro Training redirect
      {
        source: '/pro-training',
        destination: '/vylo',
        permanent: true,
      },
      {
        source: '/pro-training/',
        destination: '/vylo',
        permanent: true,
      },
      // Shop & Services redirects
      {
        source: '/shop',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/shop/',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/racket-stringing',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/racket-stringing/',
        destination: '/contact',
        permanent: true,
      },
      // Academy program redirects
      {
        source: '/adult-academy',
        destination: '/programs/adult',
        permanent: true,
      },
      {
        source: '/adult-academy/',
        destination: '/programs/adult',
        permanent: true,
      },
      {
        source: '/junior-academy',
        destination: '/programs/junior',
        permanent: true,
      },
      {
        source: '/junior-academy/',
        destination: '/programs/junior',
        permanent: true,
      },
      {
        source: '/youth-development',
        destination: '/programs/junior',
        permanent: true,
      },
      {
        source: '/youth-development/',
        destination: '/programs/junior',
        permanent: true,
      },
      // Private Lessons redirect
      {
        source: '/private-lessons',
        destination: '/book',
        permanent: true,
      },
      {
        source: '/private-lessons/',
        destination: '/book',
        permanent: true,
      },
      // Team/Coaches redirect
      {
        source: '/the-team',
        destination: '/coaches',
        permanent: true,
      },
      {
        source: '/the-team/',
        destination: '/coaches',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig

