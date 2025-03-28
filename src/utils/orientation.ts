import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import DeviceInfo from 'react-native-device-info';

type Orientation = 'portrait' | 'landscape';

/**
 * Orientation utilities - Handle device orientation
 */
export const orientationUtils = {
  /**
   * Get current device orientation
   * @returns Current orientation
   */
  getOrientation: (): Orientation => {
    const { width, height } = Dimensions.get('window');
    return width > height ? 'landscape' : 'portrait';
  },

  /**
   * Check if device is a tablet
   * @returns Whether device is a tablet
   */
  isTablet: (): boolean => {
    return DeviceInfo.isTablet();
  },

  /**
   * Get device orientation based on screen dimensions
   * and add listener for orientation changes
   * @param callback - Function to call when orientation changes
   * @returns Current orientation and cleanup function
   */
  useOrientation: (callback?: (orientation: Orientation) => void): Orientation => {
    const [orientation, setOrientation] = useState<Orientation>(
      orientationUtils.getOrientation()
    );

    useEffect(() => {
      const updateOrientation = () => {
        const newOrientation = orientationUtils.getOrientation();
        setOrientation(newOrientation);
        if (callback) {
          callback(newOrientation);
        }
      };

      const dimensionsListener = Dimensions.addEventListener('change', updateOrientation);

      return () => {
        dimensionsListener.remove();
      };
    }, [callback]);

    return orientation;
  },

  /**
   * Get dimension adjustments based on current orientation
   * @returns Width and height adjustments
   */
  getDimensionAdjustments: (): { width: string, height: string } => {
    const orientation = orientationUtils.getOrientation();
    
    if (orientation === 'landscape') {
      return {
        width: '100%',
        height: '100%'
      };
    } else {
      return {
        width: '100%',
        height: '100%'
      };
    }
  }
};
