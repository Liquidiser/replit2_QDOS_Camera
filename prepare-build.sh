#!/bin/bash

# Script to prepare the project for building outside of Replit
# This script creates a clean copy of all necessary files for building the app

echo "Preparing QDOS Camera App for external build..."

# Create directory for build preparation
BUILD_DIR="./build-preparation"
rm -rf $BUILD_DIR
mkdir -p $BUILD_DIR

# Create package information file
echo "Creating build info file..."
cat > "$BUILD_DIR/build-info.txt" << EOF
QDOS Camera App Build Information
================================
Version: $(node -e "console.log(require('./package.json').version)")
Build prepared on: $(date)
React Native version: $(node -e "console.log(require('./package.json').dependencies['react-native'])")
EOF

# Copy source code and assets
echo "Copying source code and assets..."
mkdir -p "$BUILD_DIR/src"
cp -r src/* "$BUILD_DIR/src/"
cp -r assets "$BUILD_DIR/"

# Copy app entry points and configuration files
echo "Copying app configuration files..."
cp App.tsx "$BUILD_DIR/"
cp index.js "$BUILD_DIR/"
cp app.json "$BUILD_DIR/"
cp app.config.js "$BUILD_DIR/"
cp metro.config.js "$BUILD_DIR/"
cp babel.config.js "$BUILD_DIR/"
cp tsconfig.json "$BUILD_DIR/"
cp eas.json "$BUILD_DIR/"

# Copy android directory
echo "Copying Android files..."
cp -r android "$BUILD_DIR/"

# Copy build scripts
echo "Copying build scripts..."
cp eas-build.sh "$BUILD_DIR/"
cp -f "$(dirname "$0")/build-android.sh" "$BUILD_DIR/" 2>/dev/null || echo "Note: build-android.sh not found, skipping..."

# Copy environment files
echo "Copying environment files..."
cp .env.example "$BUILD_DIR/"
if [ -f .env ]; then
  cp .env "$BUILD_DIR/"
fi

# Copy documentation
echo "Copying documentation..."
cp README.md "$BUILD_DIR/" 2>/dev/null || touch "$BUILD_DIR/README.md"
cp API_DOCUMENTATION.md "$BUILD_DIR/" 2>/dev/null || echo "API_DOCUMENTATION.md not found"
cp APP_STRUCTURE.md "$BUILD_DIR/" 2>/dev/null || echo "APP_STRUCTURE.md not found"
cp BUILDING_APK.md "$BUILD_DIR/" 2>/dev/null || echo "BUILDING_APK.md not found"

# Create enhanced build instructions
echo "Creating build instructions..."
cat > "$BUILD_DIR/BUILD_INSTRUCTIONS.md" << EOF
# How to Build the QDOS Camera App

This document provides instructions for building the QDOS Camera App APK locally on your machine.

## Quick Start (For Experienced Developers)

1. \`npm install\`
2. Copy \`.env.example\` to \`.env\` and configure if needed
3. Build options:
   - Debug APK: \`npm run build\`
   - Release APK: \`npm run build:release\`
   - EAS Cloud Build: \`npm run eas-build\` or \`./eas-build.sh preview\`

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
   \`\`\`bash
   npm install
   \`\`\`

2. Configure environment:
   \`\`\`bash
   # Copy example environment file
   cp .env.example .env
   
   # Edit .env if needed
   nano .env
   \`\`\`

3. Build APK:
   
   For debug APK:
   \`\`\`bash
   cd android
   ./gradlew assembleDebug
   \`\`\`
   
   For release APK:
   \`\`\`bash
   cd android
   ./gradlew assembleRelease
   \`\`\`

4. Locate the built APK:
   - Debug: \`android/app/build/outputs/apk/debug/app-debug.apk\`
   - Release: \`android/app/build/outputs/apk/release/app-release.apk\`

### Cloud Build with EAS

For a simpler build process without local environment setup:

1. Install EAS CLI:
   \`\`\`bash
   npm install -g eas-cli
   \`\`\`

2. Login to Expo:
   \`\`\`bash
   eas login
   \`\`\`

3. Run the build:
   \`\`\`bash
   # Using convenience script (recommended)
   ./eas-build.sh preview
   
   # Or directly with EAS CLI
   eas build --platform android --profile preview
   \`\`\`

4. Follow the URL in the console to track build progress and download the APK.

## Troubleshooting

- **"SDK location not found"**: Set ANDROID_HOME environment variable
- **Gradle build failures**: Check for JDK version compatibility (JDK 11 required)
- **Missing SDK components**: Use Android Studio's SDK Manager to install required components
- **Build timeouts**: Try increasing Gradle memory in \`android/gradle.properties\`:
  \`org.gradle.jvmargs=-Xmx4g\`

For more detailed information, see the full BUILDING_APK.md in the project root.
EOF

# Create an updated package.json with build scripts
echo "Creating package.json with build scripts..."
node -e "
  const pkg = require('./package.json');
  const simplifiedPkg = {
    name: pkg.name || 'qdos-camera-app',
    version: pkg.version || '1.0.0',
    description: pkg.description || 'QDOS Camera App for Android',
    main: 'index.js',
    dependencies: pkg.dependencies,
    scripts: {
      'start': 'react-native start',
      'build': 'cd android && ./gradlew assembleDebug',
      'build:release': 'cd android && ./gradlew assembleRelease',
      'eas-build': 'eas build --platform android --profile preview',
      'eas-build:dev': 'eas build --platform android --profile development',
      'eas-build:prod': 'eas build --platform android --profile production'
    }
  };
  console.log(JSON.stringify(simplifiedPkg, null, 2));
" > "$BUILD_DIR/package.json"

# Create a .gitignore file
echo "Creating .gitignore file..."
cat > "$BUILD_DIR/.gitignore" << EOF
# Node
node_modules/
npm-debug.log
yarn-error.log

# Android/IntelliJ
android/app/build/
android/app/gradle/
android/app/gradlew
android/app/gradlew.bat
android/.gradle
android/.idea
android/local.properties
android/*.iml
android/.settings

# iOS
ios/build/
ios/Pods/
ios/*.pbxuser
ios/*.perspectivev3
ios/*.mode1v3
ios/*.mode2v3
ios/*.xcuserstate
ios/project.xcworkspace
ios/xcuserdata

# Environment variables
.env

# Misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local
EOF

echo "=============================="
echo "Build preparation complete!"
echo "All necessary files are in the '$BUILD_DIR' directory."
echo ""
echo "To build the app:"
echo "1. Copy the build-preparation directory to your local machine"
echo "2. Follow the instructions in BUILD_INSTRUCTIONS.md"
echo "=============================="