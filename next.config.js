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
    // Add fallbacks for Node.js modules when building for client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'grpc-js': false,
        'encoding': false,
        'buffer': false,
      };
    } else {
      // Mark grpc-js as external for server-side to prevent bundling issues
      config.externals = config.externals || [];
      config.externals.push('grpc-js');
    }

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