import 'dotenv/config';

export default {
  name: "QDOS Camera",
  slug: "qdos-camera-app",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  owner: "liquidiser",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  updates: {
    fallbackToCacheTimeout: 0,
    url: "https://u.expo.dev/12702e56-bc25-4c1d-8523-66ad33a93e77"
  },
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.qdos.cameraapp"
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#FFFFFF"
    },
    package: "com.qdos.cameraapp",
    permissions: [
      "CAMERA",
      "RECORD_AUDIO",
      "READ_EXTERNAL_STORAGE",
      "WRITE_EXTERNAL_STORAGE"
    ]
  },
  web: {
    favicon: "./assets/favicon.png"
  },
  plugins: [
    "expo-dev-client"
  ],
  extra: {
    eas: {
      projectId: "12702e56-bc25-4c1d-8523-66ad33a93e77"
    }
  },
  runtimeVersion: {
    policy: "sdkVersion"
  },
  sdkVersion: "50.0.0"
};