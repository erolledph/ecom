/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
  images: {
    unoptimized: true,
  },
  assetPrefix: '',
  basePath: '',
  experimental: {
    esmExternals: 'loose',
  },
  webpack: (config) => {
    // Configure webpack for Firebase compatibility
    config.resolve.alias = {
      ...config.resolve.alias,
      // Force Firebase to use the full modules instead of lite versions
      'firebase/app': require.resolve('firebase/app'),
      'firebase/auth': require.resolve('firebase/auth'),
      'firebase/firestore': require.resolve('firebase/firestore'),
      'firebase/storage': require.resolve('firebase/storage'),
    };
    
    // Exclude Node.js modules from client bundle
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      util: false,
      url: false,
      buffer: false,
    };
    
    return config;
  },
};

module.exports = nextConfig;
