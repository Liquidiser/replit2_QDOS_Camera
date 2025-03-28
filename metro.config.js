/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 */

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    // Add additional asset extensions for specific use cases
    sourceExts: ['jsx', 'js', 'ts', 'tsx', 'json'],
    assetExts: ['rive', 'riv', 'svg', 'bmp', 'gif', 'jpg', 'jpeg', 'png', 'webp'],
  },
};
