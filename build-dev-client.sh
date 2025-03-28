#!/bin/bash

# Set environment variables for EAS CLI
export EAS_NO_VCS=1
export EAS_BUILD_DISABLE_GIT=1
export EXPO_DEBUG=1
export EXPO_TOKEN=5FWerkLIo-HkD0c4JJ-pdnYybz8bXYeBRtOT89A9

# Create a development client build
echo "Starting development client build for Android..."
npx eas-cli build \
  --platform android \
  --profile development \
  --non-interactive \
  --no-wait

echo "Build submitted! Check your Expo dashboard for the download link."
echo "Project ID: 12702e56-bc25-4c1d-8523-66ad33a93e77"
echo "Dashboard link: https://expo.dev/accounts/liquidiser/projects/qdos-camera-app/builds"