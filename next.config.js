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
    // Handle Firebase/undici compatibility issues
    config.resolve.alias = {
      ...config.resolve.alias,
      'undici': false,
    };
    
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
    
    // Ignore undici in client-side bundles
    config.externals = config.externals || [];
    config.externals.push('undici');
    
    return config;
  },
};

module.exports = nextConfig;
