/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

// Import getDefaultConfig from Expo if available, otherwise from React Native
const { getDefaultConfig } = require('expo/metro-config') || require('@react-native/metro-config');

const config = getDefaultConfig(__dirname);

// Add additional asset extensions for specific use cases
config.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'json'];
config.resolver.assetExts = [...config.resolver.assetExts, 'rive', 'riv'];

// Add support for symlinks (used by some Expo/EAS features)
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Custom resolution logic can be added here if needed
  // This will help with monorepo setups or special resolution cases
  return context.resolveRequest(context, moduleName, platform);
};

// If you use babel to transform your code, uncomment the following
// config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');

module.exports = config;
