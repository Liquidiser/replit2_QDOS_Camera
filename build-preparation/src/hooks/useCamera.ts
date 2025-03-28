import { useCallback, useEffect, useRef, useState } from 'react';
import { Camera, CameraProps, CameraDevice } from 'react-native-vision-camera';
import { permissionUtils } from '../utils/permissions';
import { CameraState } from '../types';

interface UseCameraOptions {
  enableAudio?: boolean;
}

/**
 * Custom hook for camera functionality
 * @param options - Camera configuration options
 * @returns Camera state and controls
 */
export const useCamera = (options: UseCameraOptions = { enableAudio: true }) => {
  // Camera ref for accessing camera methods
  const cameraRef = useRef<Camera>(null);
  
  // Camera state
  const [cameraState, setCameraState] = useState<CameraState>({
    isActive: false,
    hasCameraPermission: null,
    hasStoragePermission: null,
    flashMode: 'off',
    deviceOrientation: 'portrait'
  });
  
  // Available devices
  const [devices, setDevices] = useState<CameraDevice[]>([]);
  const [activeDevice, setActiveDevice] = useState<CameraDevice | null>(null);

  // Request permissions on mount
  useEffect(() => {
    const requestPermissions = async () => {
      const cameraPermission = await permissionUtils.requestCameraPermission();
      const storagePermission = await permissionUtils.requestStoragePermission();
      
      // Request microphone permission if audio is enabled
      let microphonePermission = true;
      if (options.enableAudio) {
        microphonePermission = await permissionUtils.requestMicrophonePermission();
      }
      
      setCameraState(prev => ({
        ...prev,
        hasCameraPermission: cameraPermission,
        hasStoragePermission: storagePermission
      }));
      
      // Only activate camera if all required permissions are granted
      if (cameraPermission && storagePermission && (options.enableAudio ? microphonePermission : true)) {
        setCameraState(prev => ({ ...prev, isActive: true }));
      }
    };

    requestPermissions();
  }, [options.enableAudio]);

  // Get available camera devices
  useEffect(() => {
    const getDevices = async () => {
      const availableDevices = await Camera.getAvailableCameraDevices();
      setDevices(availableDevices);
      
      // Set default device to the back camera
      const backCamera = availableDevices.find(d => d.position === 'back');
      if (backCamera) {
        setActiveDevice(backCamera);
      } else if (availableDevices.length > 0) {
        setActiveDevice(availableDevices[0]);
      }
    };

    getDevices();
  }, []);

  // Toggle flash mode
  const toggleFlash = useCallback(() => {
    setCameraState(prev => ({
      ...prev,
      flashMode: prev.flashMode === 'off' ? 'on' : 'off'
    }));
  }, []);

  // Switch between front and back camera
  const switchCamera = useCallback(() => {
    if (devices.length <= 1) return;
    
    const currentPosition = activeDevice?.position;
    const newPosition = currentPosition === 'back' ? 'front' : 'back';
    
    const newDevice = devices.find(d => d.position === newPosition);
    if (newDevice) {
      setActiveDevice(newDevice);
    }
  }, [devices, activeDevice]);

  // Take a photo
  const takePhoto = useCallback(async () => {
    if (!cameraRef.current || !cameraState.isActive) return null;
    
    try {
      const photo = await cameraRef.current.takePhoto({
        flash: cameraState.flashMode,
        qualityPrioritization: 'quality',
        enableShutterSound: false
      });
      
      return {
        uri: `file://${photo.path}`,
        width: photo.width,
        height: photo.height
      };
    } catch (error) {
      console.error('Error taking photo:', error);
      return null;
    }
  }, [cameraState.isActive, cameraState.flashMode]);

  // Start video recording
  const startRecording = useCallback(() => {
    if (!cameraRef.current || !cameraState.isActive) return;
    
    cameraRef.current.startRecording({
      flash: cameraState.flashMode,
      onRecordingFinished: (video) => {
        // Handled by stopRecording callback
      },
      onRecordingError: (error) => {
        console.error('Video recording error:', error);
      }
    });
  }, [cameraState.isActive, cameraState.flashMode]);

  // Stop video recording
  const stopRecording = useCallback(async () => {
    if (!cameraRef.current || !cameraState.isActive) return null;
    
    try {
      const video = await cameraRef.current.stopRecording();
      return {
        uri: `file://${video.path}`,
        type: 'video'
      };
    } catch (error) {
      console.error('Error stopping recording:', error);
      return null;
    }
  }, [cameraState.isActive]);

  // Focus the camera at a specific point
  const focus = useCallback(async (x: number, y: number) => {
    if (!cameraRef.current || !cameraState.isActive) return;
    
    try {
      await cameraRef.current.focus({ x, y });
    } catch (error) {
      console.error('Error focusing camera:', error);
    }
  }, [cameraState.isActive]);

  return {
    cameraRef,
    cameraState,
    devices,
    activeDevice,
    takePhoto,
    startRecording,
    stopRecording,
    toggleFlash,
    switchCamera,
    focus
  };
};
