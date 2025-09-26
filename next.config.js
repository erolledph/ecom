/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  trailingSlash: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  experimental: {
    esmExternals: 'loose',
    serverComponentsExternalPackages: ['firebase-admin']
  },
  images: {
    domains: [
      'images.unsplash.com',
      'placehold.co',
      'firebasestorage.googleapis.com',
      'storage.googleapis.com'
    ],
    unoptimized: true
  },
  transpilePackages: ['firebase', '@firebase/auth', '@firebase/firestore', '@firebase/app'],
  webpack: (config, { isServer }) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/node_modules/**']
    };
    
    // Add fallbacks for Node.js modules when building for client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        'encoding': false,
        'buffer': false
      };
      
      // Prevent firebase-admin from being bundled on client-side
      config.resolve.alias = {
        ...config.resolve.alias,
        'firebase-admin': false
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
      /Can't resolve 'grpc-js'/
    ];

    // Optimize bundle size
    if (!isServer) {
      // Let Next.js handle Firebase module resolution automatically
      // using the exports field in package.json files
    }

    return config;
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: false
  }
};

module.exports = nextConfig;