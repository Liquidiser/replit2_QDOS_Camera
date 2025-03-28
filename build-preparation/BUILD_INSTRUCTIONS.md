# How to Build the QDOS Camera App

This document provides instructions for building the QDOS Camera App APK locally on your machine.

## Quick Start (For Experienced Developers)

1. `npm install`
2. Copy `.env.example` to `.env` and configure if needed
3. Build options:
   - Debug APK: `npm run build`
   - Release APK: `npm run build:release`
   - EAS Cloud Build: `npm run eas-build` or `./eas-build.sh preview`

## Prerequisites

1. **Node.js** - Version 18.x or newer recommended
   - Download from: https://nodejs.org/

2. **Java Development Kit (JDK)** - Version 11 required for Android development
   - Download from: https://adoptium.net/ (OpenJDK)

3. **Android Development Environment**:
   - Android Studio (for SDK Manager): https://developer.android.com/studio
   - Required SDK components:
     - Android SDK Platform 34
     - Android SDK Build-Tools 34.0.0
     - Android SDK Platform-Tools
     - NDK 25.1.8937393

4. **Environment Variables**:
   - ANDROID_HOME: path to Android SDK
   - JAVA_HOME: path to JDK installation

## Detailed Build Steps

### Local Build

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment:
   ```bash
   # Copy example environment file
   cp .env.example .env
   
   # Edit .env if needed
   nano .env
   ```

3. Build APK:
   
   For debug APK:
   ```bash
   cd android
   ./gradlew assembleDebug
   ```
   
   For release APK:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

4. Locate the built APK:
   - Debug: `android/app/build/outputs/apk/debug/app-debug.apk`
   - Release: `android/app/build/outputs/apk/release/app-release.apk`

### Cloud Build with EAS

For a simpler build process without local environment setup:

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```

2. Login to Expo:
   ```bash
   eas login
   ```

3. Run the build:
   ```bash
   # Using convenience script (recommended)
   ./eas-build.sh preview
   
   # Or directly with EAS CLI
   eas build --platform android --profile preview
   ```

4. Follow the URL in the console to track build progress and download the APK.

## Troubleshooting

- **"SDK location not found"**: Set ANDROID_HOME environment variable
- **Gradle build failures**: Check for JDK version compatibility (JDK 11 required)
- **Missing SDK components**: Use Android Studio's SDK Manager to install required components
- **Build timeouts**: Try increasing Gradle memory in `android/gradle.properties`:
  `org.gradle.jvmargs=-Xmx4g`

For more detailed information, see the full BUILDING_APK.md in the project root.
