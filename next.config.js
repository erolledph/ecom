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
    esmExternals: false,
  },
  webpack: (config, { isServer }) => {
    // Handle Firebase compatibility
    config.resolve.alias = {
      ...config.resolve.alias,
      // Force Firebase to use browser versions
      'firebase/app': require.resolve('firebase/app'),
      'firebase/auth': require.resolve('firebase/auth'),
      'firebase/firestore': require.resolve('firebase/firestore'),
      'firebase/storage': require.resolve('firebase/storage'),
    };
    
    // Exclude problematic Node.js modules from client bundle
    if (!isServer) {
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
        process: false,
        path: false,
        os: false,
        http: false,
        https: false,
        zlib: false,
        querystring: false,
        child_process: false,
        worker_threads: false,
        perf_hooks: false,
        undici: false,
      };
    }
    
    // Handle undici module issues
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false,
      },
    });
    
    // Exclude undici from client-side bundle
    config.externals = config.externals || [];
    if (!isServer) {
      config.externals.push('undici');
    }
    
    return config;
  },
};

module.exports = nextConfig;