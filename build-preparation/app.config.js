import 'dotenv/config';

export default {
  name: "QDOS Camera",
  slug: "replit2qdoscamera",
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
    url: "https://u.expo.dev/9db4926b-e42d-483e-9553-3da6433c03dd"
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
      projectId: "9db4926b-e42d-483e-9553-3da6433c03dd"
    }
  },
  runtimeVersion: {
    policy: "sdkVersion"
  },
  sdkVersion: "50.0.0"
};