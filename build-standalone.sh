#!/bin/bash

# Set environment variables for EAS CLI
export EAS_NO_VCS=1
export EAS_BUILD_DISABLE_GIT=1
export EXPO_DEBUG=1
export EXPO_TOKEN=5FWerkLIo-HkD0c4JJ-pdnYybz8bXYeBRtOT89A9

# Create a standalone Android build
echo "Starting standalone Android build..."
timeout 60 npx eas-cli build \
  --platform android \
  --profile preview \
  --non-interactive \
  --no-wait

echo "Build submitted! Check your Expo dashboard for the download link."
echo "Project ID: 9db4926b-e42d-483e-9553-3da6433c03dd"
echo "Dashboard link: https://expo.dev/accounts/liquidiser/projects/qdos-camera-app/builds"