import { Alert, Platform } from 'react-native';
import { Camera } from 'react-native-vision-camera';
import { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions';

/**
 * Permission utilities - Handle all permission-related functionality
 */
export const permissionUtils = {
  /**
   * Request camera permission
   * @returns Whether permission was granted
   */
  requestCameraPermission: async (): Promise<boolean> => {
    try {
      const permission = await Camera.requestCameraPermission();
      return permission === 'authorized';
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      return false;
    }
  },

  /**
   * Request microphone permission (for video recording)
   * @returns Whether permission was granted
   */
  requestMicrophonePermission: async (): Promise<boolean> => {
    try {
      const permission = await Camera.requestMicrophonePermission();
      return permission === 'authorized';
    } catch (error) {
      console.error('Error requesting microphone permission:', error);
      return false;
    }
  },

  /**
   * Request storage permission (read/write)
   * @returns Whether permission was granted
   */
  requestStoragePermission: async (): Promise<boolean> => {
    try {
      if (Platform.OS === 'android') {
        // Android requires separate read/write permissions
        const readPermission = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
        const writePermission = await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
        
        return (
          readPermission === RESULTS.GRANTED && 
          writePermission === RESULTS.GRANTED
        );
      } else {
        // iOS only needs photo library permission
        const permission = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
        return permission === RESULTS.GRANTED;
      }
    } catch (error) {
      console.error('Error requesting storage permission:', error);
      return false;
    }
  },
  
  /**
   * Check if all required permissions are granted
   * @returns Object with permission status
   */
  checkAllPermissions: async (): Promise<{
    camera: boolean;
    microphone: boolean;
    storage: boolean;
  }> => {
    const cameraPermission = await Camera.getCameraPermissionStatus();
    const microphonePermission = await Camera.getMicrophonePermissionStatus();
    
    let storagePermission = false;
    
    if (Platform.OS === 'android') {
      const readResult = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
      const writeResult = await check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
      storagePermission = readResult === RESULTS.GRANTED && writeResult === RESULTS.GRANTED;
    } else {
      const photoResult = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
      storagePermission = photoResult === RESULTS.GRANTED;
    }
    
    return {
      camera: cameraPermission === 'authorized',
      microphone: microphonePermission === 'authorized',
      storage: storagePermission
    };
  },
  
  /**
   * Show permission explanation dialog
   * @param permissionType - Type of permission needed
   * @param onRequestPermission - Callback to request permission
   */
  showPermissionExplanation: (
    permissionType: 'camera' | 'microphone' | 'storage',
    onRequestPermission: () => void
  ): void => {
    const permissionMap = {
      camera: {
        title: 'Camera Permission Required',
        message: 'We need access to your camera to scan QR codes and capture photos/videos.'
      },
      microphone: {
        title: 'Microphone Permission Required',
        message: 'We need access to your microphone to record videos with sound.'
      },
      storage: {
        title: 'Storage Permission Required',
        message: 'We need access to your device storage to save captured media.'
      }
    };
    
    Alert.alert(
      permissionMap[permissionType].title,
      permissionMap[permissionType].message,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Grant Permission', onPress: onRequestPermission }
      ]
    );
  }
};
