// Memory optimization suggestions for next.config.js

const config = {
  // ... existing config ...

  // 1. 出力ファイルの最適化
  experimental: {
    // 不要なSWCバイナリを除外
    outputFileTracingExcludes: {
      '*': [
        'node_modules/@swc/core-linux-x64-gnu',
        'node_modules/@swc/core-linux-x64-musl',
        'node_modules/@esbuild/linux-x64',
        'node_modules/@ampproject/toolbox-optimizer/**',
      ],
    },
    // サーバーコンポーネントのツリーシェイキングを有効化
    serverComponentsExternalPackages: ['@babel/core', '@babel/preset-env'],
  },

  // 2. ビルド最適化
  swcMinify: true, // SWCによる最小化を確実に有効化
  
  // 3. 画像最適化
  images: {
    // 外部CDNを使用する場合
    loader: 'custom',
    loaderFile: './lib/imageLoader.js',
    // または画像サイズを制限
    deviceSizes: [640, 828, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96],
  },

  // 4. Webpackの最適化
  webpack: (config, { isServer }) => {
    if (isServer) {
      // サーバーサイドでは不要なモジュールを除外
      config.externals.push({
        'canvas': 'canvas',
        'jsdom': 'jsdom',
      });
    }
    
    // ビルドサイズを削減
    config.optimization = {
      ...config.optimization,
      minimize: true,
      moduleIds: 'deterministic',
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // ベンダーコードを分割
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
          },
        },
      },
    };

    return config;
  },
};

// CloudRun用の環境変数設定例
// Cloud Run のメモリ制限を増やす場合：
// gcloud run deploy [SERVICE_NAME] --memory 2Gi

module.exports = config;