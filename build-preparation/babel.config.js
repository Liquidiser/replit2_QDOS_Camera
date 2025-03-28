module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@components': './src/components',
          '@screens': './src/screens',
          '@navigation': './src/navigation',
          '@utils': './src/utils',
          '@hooks': './src/hooks',
          '@api': './src/api',
          '@context': './src/context',
          '@types': './src/types'
        }
      }
    ]
  ]
};
