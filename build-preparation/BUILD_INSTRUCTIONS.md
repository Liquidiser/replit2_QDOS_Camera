# How to Build QDOS Camera App

Follow these steps to build the app on your local machine:

## Prerequisites

1. Install Node.js (v14+) and npm
2. Install JDK 11
3. Install Android Studio and Android SDK
4. Configure Android SDK Environment Variables
5. Install React Native CLI globally: `npm install -g react-native-cli`

## Steps to Build

1. Clone the entire repository: `git clone https://github.com/Liquidiser/replit2_QDOS_Camera.git`
2. Navigate to project directory: `cd replit2_QDOS_Camera`
3. Install dependencies: `npm install`
4. Configure .env file (copy from .env.example and add your values)
5. For debug APK:
   ```
   cd android
   ./gradlew assembleDebug
   ```
6. For release APK (needs signing configuration):
   ```
   cd android
   ./gradlew assembleRelease
   ```

The built APK will be available at:
- Debug: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release: `android/app/build/outputs/apk/release/app-release.apk`

## Alternative: EAS Build

For cloud-based builds:

1. Install EAS CLI: `npm install -g eas-cli`
2. Login to Expo: `eas login`
3. Run build: `eas build --platform android --profile preview`

Follow the URL in the console to track build progress and download the APK.
