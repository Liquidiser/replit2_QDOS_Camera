# QDOS Camera App Development Guide

This guide provides instructions for building and testing the QDOS Camera App using the provided source package.

## Option 1: Using the Source Package

The `qdos-camera-source.zip` file (15MB) contains all the necessary source code to build and run the application locally.

### Prerequisites
- Node.js 18+ installed
- Java Development Kit (JDK) 11+ installed
- Android Studio installed with Android SDK
- Android device or emulator for testing

### Setup Instructions

1. Download the `qdos-camera-source.zip` file from this Replit workspace
2. Extract the zip file to a local directory
3. Open a terminal/command prompt in the extracted directory
4. Install dependencies:
   ```bash
   npm install
   ```
5. Install the Expo CLI globally:
   ```bash
   npm install -g expo-cli
   ```

### Development Build (For Testing)

For the fastest testing experience, use the development build method:

1. Connect your Android device via USB (make sure USB debugging is enabled)
2. Run the following command to build and install the app on your device:
   ```bash
   npx expo run:android
   ```
   
This will build a debug version of the app and install it directly on your connected device.

### Production Build (Release APK)

To create a release APK that can be installed on any Android device:

1. Generate a signing key (if you don't already have one):
   ```bash
   keytool -genkey -v -keystore qdos-camera-key.keystore -alias qdos-camera -keyalg RSA -keysize 2048 -validity 10000
   ```
   
2. Create a `gradle.properties` file in the `android` directory with your key information:
   ```
   MYAPP_UPLOAD_STORE_FILE=qdos-camera-key.keystore
   MYAPP_UPLOAD_KEY_ALIAS=qdos-camera
   MYAPP_UPLOAD_STORE_PASSWORD=<your-keystore-password>
   MYAPP_UPLOAD_KEY_PASSWORD=<your-key-password>
   ```
   
3. Build the release APK:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```
   
4. The APK will be generated at:
   ```
   android/app/build/outputs/apk/release/app-release.apk
   ```

## Option 2: Using Expo EAS Builds (Cloud Building)

If you prefer not to set up a local development environment, you can use Expo's EAS Build service:

1. Install the EAS CLI:
   ```bash
   npm install -g eas-cli
   ```
   
2. Log in to your Expo account:
   ```bash
   eas login
   ```
   
3. Run the build command:
   ```bash
   eas build --platform android --profile preview
   ```
   
4. Follow the link provided to monitor the build progress. Once complete, you'll be able to download the APK file.

## Testing the App

1. Install the APK on your Android device
2. Ensure you have:
   - Camera permissions enabled for the app
   - Storage permissions enabled for the app
   
3. Test the core functionality:
   - QR code scanning
   - Media capture (photos and videos)
   - Viewing captured media
   - Uploading media to the server (requires API key configuration)

## Troubleshooting

### Camera Issues
- Ensure the app has camera permissions
- Check that your device supports Camera2 API

### Build Issues
- Make sure you have the correct JDK version installed (11+)
- Verify Android SDK is properly installed and paths are set correctly
- For gradle errors, try running `./gradlew clean` before rebuilding

### API Connection Issues
- Verify the API key in the .env file is correct
- Ensure your device has an internet connection

## Additional Resources

- React Native Documentation: https://reactnative.dev/docs/getting-started
- Expo Documentation: https://docs.expo.dev/
- Android Studio Guide: https://developer.android.com/studio/intro