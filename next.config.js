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
  webpack: (config) => {
    // Exclude Node.js modules from client bundle
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    // Ignore specific modules that cause issues
    config.externals = config.externals || [];
    config.externals.push({
      'undici': 'undici',
      'node:crypto': 'crypto',
      'node:stream': 'stream',
      'node:util': 'util',
      'node:url': 'url',
      'node:buffer': 'buffer',
    });
    
    // Add webpack alias to resolve firebase/storage/lite to firebase/storage
    config.resolve.alias = {
      ...config.resolve.alias,
      'firebase/storage/lite': 'firebase/storage',
    };
    
    return config;
  },
};

module.exports = nextConfig;
