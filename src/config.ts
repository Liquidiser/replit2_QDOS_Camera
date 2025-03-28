/**
 * Application Configuration
 * 
 * This file contains configuration settings for the QDOS Camera App.
 * In a production environment, sensitive values should be stored securely
 * and potentially loaded from environment variables or secure storage.
 */

import { Platform } from 'react-native';

// API Configuration
export const API_CONFIG = {
  // Base URL for the QDOS API
  BASE_URL: 'https://admin.qdos.bz/api/',
  
  // Timeout for API requests in milliseconds
  TIMEOUT: 30000,
  
  // Default headers for API requests
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
};

// App Configuration
export const APP_CONFIG = {
  // Default app name
  APP_NAME: 'QDOS Camera App',
  
  // Version information
  VERSION: '1.0.0',
  
  // Platform-specific settings
  PLATFORM: Platform.OS,
  
  // Media configuration
  MEDIA: {
    // Maximum video duration in seconds
    MAX_VIDEO_DURATION: 60,
    
    // Quality settings for photo/video
    PHOTO_QUALITY: 0.8, // 0 to 1
    VIDEO_QUALITY: '720p', // '480p', '720p', '1080p'
    
    // Base directory for storing media files
    STORAGE_DIR: 'QDOS_Media',
  },
  
  // Feature flags
  FEATURES: {
    ENABLE_TWITTER_SHARING: true,
    ENABLE_VIDEO_CAPTURE: true,
    ENABLE_ANIMATIONS: true,
  },
};

export default {
  API: API_CONFIG,
  APP: APP_CONFIG,
};