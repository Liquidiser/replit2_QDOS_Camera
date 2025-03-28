#!/bin/bash

# Script to build Android APK

# Show help
if [ "$1" == "-h" ] || [ "$1" == "--help" ]; then
  echo "Usage: ./build-android.sh [debug|release]"
  echo "Options:"
  echo "  debug    Build a debug APK (default)"
  echo "  release  Build a release APK"
  exit 0
fi

# Set build type
BUILD_TYPE=${1:-debug}
echo "Building $BUILD_TYPE APK..."

# Clean any previous builds
echo "Cleaning previous builds..."
cd android && ./gradlew clean

# Build the APK based on the specified type
if [ "$BUILD_TYPE" == "debug" ]; then
  echo "Building debug APK..."
  ./gradlew assembleDebug
  APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
elif [ "$BUILD_TYPE" == "release" ]; then
  echo "Building release APK..."
  ./gradlew assembleRelease
  APK_PATH="app/build/outputs/apk/release/app-release.apk"
else
  echo "Invalid build type. Use 'debug' or 'release'."
  exit 1
fi

# Check if build was successful
if [ -f "$APK_PATH" ]; then
  echo "Build successful!"
  echo "APK is available at: $APK_PATH"
  
  # Calculate APK size
  APK_SIZE=$(du -h "$APK_PATH" | cut -f1)
  echo "APK size: $APK_SIZE"
  
  # Optional: Install on connected device
  if [ "$2" == "--install" ]; then
    echo "Installing APK on connected device..."
    adb install -r "$APK_PATH"
  fi
else
  echo "Build failed. Check the logs for errors."
  exit 1
fi

cd ..