const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (config) => {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        vm: require.resolve('vm-browserify'),
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer/')
      };

      config.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer']
        })
      );

      return config;
    }
  },
  jest: {
    configure: (jestConfig) => {
      // 3. Handle CSS/asset imports in tests (if needed)
      jestConfig.transformIgnorePatterns = [
        '/node_modules/(?!(@react-leaflet|react-leaflet|bcryptjs)/)'
      ];
      return jestConfig;
    }
  }
};
