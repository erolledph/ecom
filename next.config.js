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

    // Always exclude server-only packages from bundling
    config.externals = config.externals || [];
    
    // Add server-only packages to externals
    const serverOnlyPackages = [
      'cheerio',
      'node-fetch',
      'undici',
      '@types/cheerio',
      '@types/node-fetch'
    ];

    if (!isServer) {
      // Client-side: completely exclude server-only packages
      config.resolve.fallback = {
        ...config.resolve.fallback,
        ...serverOnlyPackages.reduce((acc, pkg) => {
          acc[pkg] = false;
          return acc;
        }, {}),
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
        util: false,
        querystring: false,
      };
      
      // Add to externals for client-side
      config.externals.push(...serverOnlyPackages);
    } else {
      // Server-side: allow these packages but mark them as external for edge runtime
      config.externals.push({
        'cheerio': 'commonjs cheerio',
        'node-fetch': 'commonjs node-fetch',
        'undici': 'commonjs undici',
      });
    }

    return config;
  },
};

module.exports = nextConfig;
