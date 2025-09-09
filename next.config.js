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
  transpilePackages: ['undici'],
  webpack: (config) => {
    // Handle undici and other Node.js modules
    config.resolve.alias = {
      ...config.resolve.alias,
      'undici': false,
    };
    
    // Add rule to handle modern JavaScript syntax
    config.module.rules.push({
      test: /\.m?js$/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false,
      },
    });

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
      undici: false,
    };
    
    return config;
  },
};

module.exports = nextConfig;
