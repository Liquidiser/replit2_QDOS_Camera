# QDOS Camera App

A React Native mobile application that provides an interactive media capture and sharing experience through QR code scanning and Rive animation overlays.

## Overview

This application enables users to scan QR codes, retrieve information from the QDOS API, display Rive animations as overlays, capture photos and videos, and share content via Twitter. The app is designed primarily for Android devices.

## Features

- **QR Code Scanning**: Using the device camera, scan QR codes to retrieve detailed information from the QDOS API
- **Rive Animation Overlays**: Display interactive animations as overlays on the camera view
- **Media Capture**: Take photos and record videos with QR information overlaid
- **Local Storage**: Save captured media to the device for later use
- **Media Upload**: Upload captured media to a server with progress tracking
- **Social Sharing**: Share content on Twitter with customizable messages

## Technical Stack

- React Native
- React Navigation for app navigation
- Rive animations for interactive overlays
- Vision Camera for camera functionality
- ML Kit (via native module) for QR code detection
- Axios for API communication
- React Native FS for file system operations
- React Native Background Upload for handling uploads

## Building the Android APK

### Prerequisites

- Node.js 18 or later
- Java Development Kit (JDK) 11 or later
- Android Studio and Android SDK
- Android SDK Build-Tools, Platform Tools, and Platform SDK
- Gradle 7.4.2 or compatible version

### Setup Development Environment

1. Clone the repository to your local machine
2. Install dependencies:
   ```
   npm install
   ```
3. Make sure Android SDK is properly configured with the following components:
   - Android SDK Platform 34
   - Android SDK Build-Tools 34.0.0
   - Android SDK Platform-Tools
   - NDK 25.1.8937393

### Building a Debug APK

1. Connect an Android device or start an emulator
2. Navigate to the project root directory
3. Run the following command to build a debug APK:
   ```
   cd android && ./gradlew assembleDebug
   ```
4. The debug APK will be generated at:
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```

### Building a Release APK

1. Create a keystore file for signing (if you don't have one):
   ```
   keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```
2. Update the signing configuration in `android/app/build.gradle` with your keystore details
3. Build the release APK:
   ```
   cd android && ./gradlew assembleRelease
   ```
4. The release APK will be generated at:
   ```
   android/app/build/outputs/apk/release/app-release.apk
   ```

## API Configuration

The app communicates with the QDOS API. In App.tsx, you can modify the `QDOS_API_KEY` value to use your own API key.

## Testing

The application has been designed with testing in mind:
- Unit tests for business logic
- Component tests for UI elements
- Integration tests for API communication

To run tests:
```
npm test
```

## Troubleshooting Build Issues

If you encounter build issues, try the following:
1. Clean the Gradle cache: `cd android && ./gradlew clean`
2. Check Java version compatibility (JDK 11 is recommended)
3. Make sure all dependencies are properly installed
4. Increase Gradle memory allocation in `android/gradle.properties` if needed
5. Verify that all required Android SDK components are installed
