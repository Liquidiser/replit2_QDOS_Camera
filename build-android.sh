#!/bin/bash

# Script to build Android APK directly

# Show help
if [ "$1" == "-h" ] || [ "$1" == "--help" ]; then
  echo "Usage: ./build-android.sh [debug|release]"
  echo "Options:"
  echo "  debug    Build a debug APK (default)"
  echo "  release  Build a release APK (requires signing configuration)"
  exit 0
fi

# Set build type
BUILD_TYPE=${1:-debug}
echo "Starting Android build ($BUILD_TYPE)..."

# Check environment
if [ -z "$ANDROID_HOME" ]; then
  echo "ANDROID_HOME environment variable is not set."
  echo "Please set it to your Android SDK location."
  exit 1
fi

# Navigate to android directory
cd android || { echo "Android directory not found"; exit 1; }

# Clean project
echo "Cleaning project..."
./gradlew clean

# Build APK
echo "Building $BUILD_TYPE APK..."
if [ "$BUILD_TYPE" == "release" ]; then
  ./gradlew assembleRelease
else
  ./gradlew assembleDebug
fi

# Check if build was successful
if [ $? -eq 0 ]; then
  # Determine output path
  if [ "$BUILD_TYPE" == "release" ]; then
    APK_PATH="app/build/outputs/apk/release/app-release.apk"
  else
    APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
  fi
  
  # Check if APK was created
  if [ -f "$APK_PATH" ]; then
    echo "============================="
    echo "Build successful!"
    echo "APK location: $(pwd)/$APK_PATH"
    echo "============================="
    
    # Copy to root directory for easier access
    cp "$APK_PATH" "../qdos-camera-$BUILD_TYPE.apk"
    echo "APK also copied to: ../qdos-camera-$BUILD_TYPE.apk"
  else
    echo "Error: APK not found at expected location."
    exit 1
  fi
else
  echo "Build failed. Check the logs above for errors."
  exit 1
fi

# Return to root directory
cd ..