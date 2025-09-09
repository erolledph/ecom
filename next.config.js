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
      
      // Exclude Firebase Storage from client bundle to avoid undici issues
      config.externals = config.externals || [];
      config.externals.push({
        'firebase/storage': 'firebase/storage',
        'undici': 'undici'
      });
    }
    
    // Handle module resolution issues
    config.resolve.alias = {
      ...config.resolve.alias,
      // Ensure proper Firebase module resolution
      'firebase/app': require.resolve('firebase/app'),
      'firebase/auth': require.resolve('firebase/auth'),
      'firebase/firestore': require.resolve('firebase/firestore'),
    };
    
    // Add rule to handle ES modules properly
    config.module.rules.push({
      test: /\.m?js$/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false,
      },
    });
    
    // Ignore undici parsing issues
    config.ignoreWarnings = [
      /Failed to parse source map/,
      /Critical dependency: the request of a dependency is an expression/,
      /Module parse failed.*undici/,
    ];
    
    return config;
  },
};

module.exports = nextConfig;