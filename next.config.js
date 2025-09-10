/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'placehold.co',
      'firebasestorage.googleapis.com'
    ],
  },
  transpilePackages: ['firebase', '@firebase/auth', '@firebase/firestore', '@firebase/app'],
  experimental: {
    esmExternals: 'loose'
  },
  webpack: (config, { isServer }) => {
    // Ignore specific warnings that don't affect functionality
    config.ignoreWarnings = [
      /Critical dependency: the request of a dependency is an expression/,
      /Module not found: Can't resolve 'encoding'/,
      /Module parse failed: Unexpected token/,
    ];

    return config;
  },
};

module.exports = nextConfig;