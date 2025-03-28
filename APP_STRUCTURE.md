# QDOS Camera App Structure

This document provides an overview of the QDOS Camera App architecture, explaining key components, modules, and design patterns.

## Project Architecture

The application follows a feature-based architecture with the following main directories:

```
/src
  /api           - API service modules
  /components    - Reusable UI components
  /context       - Global state management
  /hooks         - Custom React hooks
  /navigation    - Navigation configuration
  /screens       - Screen components
  /types         - TypeScript type definitions
  /utils         - Utility functions
```

## Key Components

### API Layer

The API layer is organized into service modules:

- **apiClient.ts** - Core API client with request handling, error management, and authentication
- **qrService.ts** - QR code related API operations
- **mediaService.ts** - Media upload and management
- **twitterService.ts** - Social media integration for Twitter

### React Components

- **CameraView.tsx** - Camera interface with QR scanning capabilities
- **QRScanner.tsx** - QR code detection and processing
- **MediaPreview.tsx** - Display and management of captured media
- **UploadProgress.tsx** - Visual indicator for upload operations
- **ShareButton.tsx** - Social media sharing interface
- **RiveAnimation.tsx** - Rive animation renderer component
- **CaptureButton.tsx** - Multi-functional button for photo/video capture
- **ErrorDisplay.tsx** - Error visualization and recovery options

### Custom Hooks

- **useCamera.ts** - Camera access, permissions, and control
- **useQRScanner.ts** - QR code scanning functionality
- **useMediaCapture.ts** - Media capture, processing, and storage

### Navigation

- **AppNavigator.tsx** - Main navigation structure using React Navigation

### Screens

- **HomeScreen.tsx** - Application entry point
- **ScanScreen.tsx** - QR code scanning interface
- **MediaScreen.tsx** - Media capture and preview
- **ShareScreen.tsx** - Social sharing options

### Utilities

- **fileStorage.ts** - File system operations
- **permissions.ts** - Permission management
- **orientation.ts** - Device orientation detection

## Data Flow

1. **QR Scanning Flow**:
   - User scans QR code via CameraView/QRScanner
   - QRScanner hook processes the scan
   - API call retrieves QR details
   - Rive animations are displayed according to orientation
   - User can capture media with the QR overlay

2. **Media Capture Flow**:
   - Media is captured via camera
   - Files are saved to local storage
   - Preview is shown for user confirmation
   - Media can be uploaded to the server
   - Upload progress is displayed

3. **Sharing Flow**:
   - User selects media to share
   - Twitter integration generates share links
   - Content is prepared and shared to social media

## State Management

The app uses React Context API for global state management:

- **AppContext** - Manages global application state including:
  - QR code information
  - Media files
  - Upload status
  - Permissions
  - Loading states
  - Error states

## Native Modules

The app uses several native modules for enhanced functionality:

- **react-native-vision-camera** - Advanced camera capabilities
- **react-native-fs** - File system access
- **react-native-background-upload** - Background upload processing
- **rive-react-native** - Rive animation rendering

## Key Design Patterns

1. **Repository Pattern** - API services abstract data access
2. **Dependency Injection** - Context provides state and services
3. **Custom Hooks** - Encapsulate and reuse complex logic
4. **Composition** - UI built from smaller, reusable components
5. **Error Boundary** - Graceful error handling

## Build System

- Uses React Native CLI (non-Expo) for full native access
- Android build configured via Gradle
- EAS (Expo Application Services) for cloud builds

## Performance Considerations

- Media files are processed efficiently to minimize memory usage
- Large files are compressed before upload
- Background uploads to prevent UI blocking
- Animations optimized for smooth performance
- Proper error handling and recovery mechanisms