#!/bin/bash

# Script to trigger an EAS build with improved error handling

# Set error handling
set -e

# Show help
if [ "$1" == "-h" ] || [ "$1" == "--help" ]; then
  echo "Usage: ./eas-build.sh [development|preview|production]"
  echo "Options:"
  echo "  development  Build a development client APK"
  echo "  preview      Build an internal testing APK (default)"
  echo "  production   Build a production app bundle"
  exit 0
fi

# Set build profile
BUILD_PROFILE=${1:-preview}
echo "======================================================================================="
echo "Starting EAS build with profile: $BUILD_PROFILE"
echo "======================================================================================="

# Check if npx is available
if ! command -v npx &> /dev/null; then
  echo "Error: npx is required but not installed."
  echo "Please install Node.js which includes npx: https://nodejs.org/"
  exit 1
fi

# Install or update EAS CLI locally
echo "Installing/updating EAS CLI locally..."
npm install --save-dev eas-cli@latest

# Verify package.json exists
if [ ! -f "package.json" ]; then
  echo "Error: package.json not found. Are you in the project root directory?"
  exit 1
fi

# Check if app.config.js exists
if [ ! -f "app.config.js" ]; then
  echo "Error: app.config.js not found. This file is required for EAS builds."
  exit 1
fi

# Check if eas.json exists
if [ ! -f "eas.json" ]; then
  echo "Error: eas.json not found. Run 'npx eas-cli init' to create it."
  exit 1
fi

# Check if user is logged in via EXPO_TOKEN or prompt for login
if [ -z "$EXPO_TOKEN" ]; then
  echo "Checking EAS login status..."
  EAS_USER=$(npx eas-cli whoami 2>/dev/null) || {
    echo "Not logged in to EAS. Please login:"
    npx eas-cli login
  }
else
  echo "Using EXPO_TOKEN for authentication"
fi

# Create a new build
echo "Triggering EAS build for Android..."
echo "======================================================================================="
echo "EAS build typically takes at least 90 seconds to start in GitHub environments."
echo "In Replit, we'll start the build in the background and provide guidance on tracking it."

# Create a temporary file to store the build ID
BUILD_ID_FILE=$(mktemp)

# Start EAS build in background and capture its output
echo "Starting EAS build in the background. This could take 1-2 minutes to initialize..."
(npx eas-cli build --platform android --profile $BUILD_PROFILE --non-interactive > "$BUILD_ID_FILE" 2>&1) &
BUILD_PID=$!

# Display a spinner while waiting for the build to initialize
echo "Waiting for build initialization..."
SPINNER="⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏"
SECONDS_PASSED=0
while kill -0 $BUILD_PID 2>/dev/null && [ $SECONDS_PASSED -lt 300 ]; do
  SPINNER_CHAR="${SPINNER:$(( SECONDS_PASSED % 10 )):1}"
  echo -ne "\r$SPINNER_CHAR Initializing build... (${SECONDS_PASSED}s)"
  sleep 1
  SECONDS_PASSED=$((SECONDS_PASSED + 1))
  
  # Check if we have the build URL already
  if grep -q "https://expo.dev/accounts/" "$BUILD_ID_FILE" 2>/dev/null; then
    BUILD_URL=$(grep -o "https://expo.dev/accounts/[^ ]*" "$BUILD_ID_FILE" | head -1)
    if [ ! -z "$BUILD_URL" ]; then
      echo -e "\nBuild successfully initiated!"
      echo "Build URL: $BUILD_URL"
      echo "You can monitor the build progress at the URL above."
      rm "$BUILD_ID_FILE"
      exit 0
    fi
  fi
done

# Check if we timed out or if the build failed
if [ $SECONDS_PASSED -ge 300 ]; then
  echo -e "\nBuild initialization taking longer than expected (timed out after 5 minutes)."
  echo "The build might still be running in the EAS servers."
  echo "Please check your EAS dashboard for status."
elif ! kill -0 $BUILD_PID 2>/dev/null; then
  # Check if the process completed and we missed catching the URL
  if grep -q "https://expo.dev/accounts/" "$BUILD_ID_FILE" 2>/dev/null; then
    BUILD_URL=$(grep -o "https://expo.dev/accounts/[^ ]*" "$BUILD_ID_FILE" | head -1)
    if [ ! -z "$BUILD_URL" ]; then
      echo -e "\nBuild successfully initiated!"
      echo "Build URL: $BUILD_URL"
      echo "You can monitor the build progress at the URL above."
      rm "$BUILD_ID_FILE"
      exit 0
    fi
  fi
  
  # Process ended but we didn't find a URL
  echo -e "\nBuild process ended unexpectedly. Checking for errors..."
  cat "$BUILD_ID_FILE"
  echo "Common issues:"
  echo "  - Invalid EXPO_TOKEN or authentication problems"
  echo "  - Project ID not found or incorrect in app.config.js"
  echo "  - Network connectivity issues"
  echo "Try running with 'npx eas-cli build --platform android --profile $BUILD_PROFILE' directly for more details."
  rm "$BUILD_ID_FILE"
  exit 1
fi

# Clean up
rm "$BUILD_ID_FILE"

# If we get here, the build is still running but we didn't find a URL yet
echo "======================================================================================="
echo "Build process started but URL not detected yet."
echo "The build is likely still initializing in EAS servers."
echo "Please check your EAS dashboard at https://expo.dev/accounts to monitor your build."
echo "Once completed, you can download the APK from your EAS dashboard."
echo "======================================================================================="