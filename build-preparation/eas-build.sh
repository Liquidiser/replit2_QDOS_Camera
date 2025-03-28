#!/bin/bash

# Script to trigger an EAS build

# Show help
if [ "$1" == "-h" ] || [ "$1" == "--help" ]; then
  echo "Usage: ./eas-build.sh [development|preview|production]"
  echo "Options:"
  echo "  development  Build a development client APK (default)"
  echo "  preview      Build an internal testing APK"
  echo "  production   Build a production app bundle"
  exit 0
fi

# Set build profile
BUILD_PROFILE=${1:-preview}
echo "Starting EAS build with profile: $BUILD_PROFILE..."

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
  echo "EAS CLI not found. Installing..."
  npm install -g eas-cli
fi

# Check if user is logged in
EAS_USER=$(npx eas-cli whoami 2>/dev/null)
if [ $? -ne 0 ]; then
  echo "Not logged in to EAS. Please login:"
  npx eas-cli login
fi

# Start the build
echo "Triggering EAS build..."
npx eas-cli build --platform android --profile $BUILD_PROFILE

echo "Build initiated. Follow the URL provided above to monitor build progress."
echo "Once completed, you can download the APK from the provided URL."