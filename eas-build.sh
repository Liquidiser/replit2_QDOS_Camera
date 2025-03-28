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
echo "EAS build typically takes at least 90 seconds to start. Setting timeout to 120 seconds..."

# Use timeout command with fallback to perl for cross-platform compatibility
if command -v timeout &> /dev/null; then
  timeout 120s npx eas-cli build --platform android --profile $BUILD_PROFILE --non-interactive || {
    echo "Build initiation timed out or failed after waiting 120 seconds."
    echo "This is normal if running in environments with limited connectivity or resources."
    echo "The build might still be running in the EAS servers. Check your EAS dashboard."
    echo "Common issues:"
    echo "  - Invalid EXPO_TOKEN or authentication problems"
    echo "  - Project ID not found or incorrect in app.config.js"
    echo "  - Network connectivity issues"
    echo "Try running with 'npx eas-cli build --platform android --profile $BUILD_PROFILE' directly for more details."
    exit 1
  }
else
  # Fallback to perl timeout for environments without the timeout command
  perl -e 'alarm 120; exec @ARGV' npx eas-cli build --platform android --profile $BUILD_PROFILE --non-interactive || {
    echo "Build initiation timed out or failed after waiting 120 seconds."
    echo "This is normal if running in environments with limited connectivity or resources."
    echo "The build might still be running in the EAS servers. Check your EAS dashboard."
    echo "Common issues:"
    echo "  - Invalid EXPO_TOKEN or authentication problems"
    echo "  - Project ID not found or incorrect in app.config.js"
    echo "  - Network connectivity issues"
    echo "Try running with 'npx eas-cli build --platform android --profile $BUILD_PROFILE' directly for more details."
    exit 1
  }
fi

echo "======================================================================================="
echo "Build successfully initiated!"
echo "Follow the URL provided above to monitor build progress."
echo "Once completed, you can download the APK from the provided URL."
echo "======================================================================================="