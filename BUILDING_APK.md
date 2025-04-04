# Building the QDOS Camera App APK

This document provides step-by-step instructions for building an Android APK of the QDOS Camera App on your local machine.

## Prerequisites

To successfully build the APK, you need the following tools installed on your system:

1. **Node.js and npm** - Version 18.x or newer
   - Download from: https://nodejs.org/

2. **Java Development Kit (JDK)** - Version 11 or newer
   - Download from: https://adoptium.net/ (OpenJDK)

3. **Android Studio**
   - Download from: https://developer.android.com/studio

4. **Android SDK** components (installed via Android Studio):
   - Android SDK Platform 34
   - Android SDK Build-Tools 34.0.0
   - Android SDK Platform-Tools
   - NDK 25.1.8937393

## Setting Up the Environment

### Step 1: Set up environment variables

You need to set up ANDROID_HOME and JAVA_HOME environment variables:

**On Windows:**

```cmd
setx ANDROID_HOME "C:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk"
setx JAVA_HOME "C:\Program Files\Java\jdk-11"
setx PATH "%PATH%;%ANDROID_HOME%\platform-tools"
```

**On macOS/Linux:**

```bash
export ANDROID_HOME=$HOME/Android/Sdk
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

Add these to your `.bash_profile` or `.zshrc` file for persistence.

### Step 2: Clone the repository and install dependencies

```bash
# Clone the repository (if needed)
git clone <repository-url>
cd QDOSCameraApp

# Install dependencies
npm install
```

## Building a Debug APK

### Step 1: Generate the debug APK

```bash
# Navigate to the Android directory
cd android

# Clean the project (optional but recommended)
./gradlew clean

# Build the debug APK
./gradlew assembleDebug
```

The generated APK will be located at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### Step 2: Install on your device

Connect your Android device via USB and enable USB debugging, then:

```bash
# Install on connected device
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

## Building a Release APK

### Step 1: Generate a signing key

You only need to do this once:

```bash
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

During this process, you'll be prompted to create a password and provide some information.

### Step 2: Configure the signing in gradle

Create a file named `keystore.properties` in the `android` directory with the following content:

```properties
storePassword=YOUR_KEYSTORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=my-key-alias
storeFile=my-release-key.keystore
```

Modify `android/app/build.gradle` to include this configuration for release builds.

### Step 3: Generate the release APK

```bash
# Navigate to the Android directory (if you're not already there)
cd android

# Build the release APK
./gradlew assembleRelease
```

The generated APK will be located at:
```
android/app/build/outputs/apk/release/app-release.apk
```

## Troubleshooting Common Issues

### Build fails with "SDK location not found"

Ensure that the ANDROID_HOME environment variable is correctly set to your Android SDK location.

### Java version compatibility issues

Make sure you're using a compatible Java version. JDK 11 is recommended for Android development.

### Gradle sync failed

Run `./gradlew --refresh-dependencies` to refresh the project's dependencies.

### Missing Android SDK components

Open Android Studio, go to SDK Manager, and install the required SDK components.

### App crashes on startup

Check the logcat output using:
```bash
adb logcat | grep -E "ReactNative|QDOS|Exception"
```

## Advanced: Creating an Android App Bundle (AAB)

For Play Store distribution, you'll need an AAB file instead of an APK:

```bash
./gradlew bundleRelease
```

The generated AAB will be located at:
```
android/app/build/outputs/bundle/release/app-release.aab
```

## Testing Tips

- Before final release, test on multiple Android versions and device sizes
- Enable ProGuard for release builds to optimize APK size
- Test permissions, camera functionality, and network connectivity
- Verify QR code scanning works in various lighting conditions

## Source Package (Recommended Approach)

The easiest way to build and test the app is using the provided source package `qdos-camera-source.zip`. For detailed instructions, please refer to [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md).

## Using EAS Cloud Builds

If you can't build locally due to environment constraints, you can use Expo Application Services (EAS) for cloud-based builds. This project includes multiple scripts to simplify the EAS build process.

### Prerequisites

1. **Expo Account** - Sign up at https://expo.dev/signup
2. **Expo CLI and EAS CLI** - These will be installed automatically by our scripts if needed

### Option 1: Using the Standalone Build Script (Recommended)

The simplest approach is to use our standalone build script:

```bash
# Make the script executable (first time only)
chmod +x build-standalone.sh

# Run the script
./build-standalone.sh
```

This script will:
1. Set the necessary environment variables
2. Trigger a non-interactive EAS build with the preview profile
3. Submit the build without waiting for completion
4. Provide you with a dashboard link where you can monitor and download the build

### Option 2: Using the Advanced Build Script

For more control over the build process:

```bash
# Make the script executable (first time only)
chmod +x eas-build.sh

# Run the script with build profile
./eas-build.sh preview
```

The script accepts the following build profiles:
- `development` - For development client builds
- `preview` - For internal testing APKs (default)
- `production` - For Play Store app bundles

This script provides more interactive features:
1. Checks if EAS CLI is installed and installs it if needed
2. Verifies you're logged in to EAS and prompts for login if needed
3. Triggers the build with the specified profile
4. Provides a URL where you can monitor build progress and download the APK

### Option 3: Manual EAS Build Process

If you prefer to run the commands manually:

1. **Install EAS CLI** (if not already installed):
   ```bash
   npm install -g eas-cli
   ```

2. **Login to your Expo account**:
   ```bash
   eas login
   ```

3. **Trigger an EAS Build**:
   For a development/internal testing build:
   ```bash
   eas build --platform android --profile preview
   ```

   For a production build:
   ```bash
   eas build --platform android --profile production
   ```

### EAS Build Configuration (eas.json)

This project includes an enhanced `eas.json` configuration:

```json
{
  "cli": {
    "version": ">= 5.9.1",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "gradleCommand": ":app:assembleDebug",
        "buildType": "apk"
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk",
        "withoutCredentials": true
      },
      "env": {
        "ENVIRONMENT": "preview"
      },
      "autoIncrement": true
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      },
      "env": {
        "ENVIRONMENT": "production"
      },
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

### Troubleshooting EAS Builds

- If you encounter credential issues, use `eas credentials` to manage them
- For build configuration problems, refer to the [EAS documentation](https://docs.expo.dev/build/introduction/)
- If you have project ID issues, you may need to run `eas project:init` to create a new project
  - Current project ID: `9db4926b-e42d-483e-9553-3da6433c03dd`

### Building Outside of Replit

Due to resource limitations in Replit, you need to extract the project and build it elsewhere. There are two approaches:

#### Method 1: Using the Source Package (Easiest, Recommended)

1. Download the `qdos-camera-source.zip` file (15MB) from this Replit workspace
2. Extract it on your local machine
3. Follow the detailed instructions in [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md)

#### Method 2: Using the Preparation Script

If you want to customize what files are included:

1. **Run the prepare-build script**:
   ```bash
   # Make script executable (first time only)
   chmod +x prepare-build.sh
   
   # Run the script
   ./prepare-build.sh
   ```

2. This will create a clean copy of all necessary files in the `build-preparation` directory.

3. Zip and download this directory from Replit.

4. On your local machine with Android SDK installed:
   ```bash
   cd build-preparation
   npm install
   
   # Option 1: Run with React Native CLI
   npx react-native run-android
   
   # Option 2: Build debug APK manually
   cd android
   ./gradlew assembleDebug
   
   # Option 3: Use Expo EAS for local building
   npm install -g eas-cli
   eas build --platform android --profile preview --local
   ```

Both methods provide all the necessary files for building, but the source package (Method 1) is pre-configured and ready to use.