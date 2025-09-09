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

    if (!isServer) {
      // Client-side configuration - force browser builds
      config.resolve.fallback = {
        ...config.resolve.fallback,
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
        // Explicitly exclude undici and other Node.js modules
        undici: false,
        'node:crypto': false,
        'node:fs': false,
        'node:http': false,
        'node:https': false,
        'node:net': false,
        'node:path': false,
        'node:stream': false,
        'node:url': false,
        'node:util': false,
      };

      // Exclude problematic modules from bundling
      config.externals = config.externals || [];
      config.externals.push({
        'node:crypto': 'crypto',
        'node:fs': 'fs',
        'node:http': 'http',
        'node:https': 'https',
        'node:net': 'net',
        'node:path': 'path',
        'node:stream': 'stream',
        'node:url': 'url',
        'node:util': 'util',
        'cheerio': 'cheerio',
        'node-fetch': 'node-fetch',
        'undici': 'undici',
      });
    }

    return config;
  },
};

module.exports = nextConfig;