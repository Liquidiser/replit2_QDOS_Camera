import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Camera } from 'react-native-vision-camera';
import { useCamera } from '../hooks/useCamera';
import { orientationUtils } from '../utils/orientation';
import CaptureButton from './CaptureButton';
import { permissionUtils } from '../utils/permissions';

interface CameraViewProps {
  onCapture?: (uri: string, type: 'photo' | 'video') => void;
  onClose?: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onCapture, onClose }) => {
  const {
    cameraRef,
    cameraState,
    activeDevice,
    takePhoto,
    startRecording,
    stopRecording,
    toggleFlash,
    switchCamera,
    focus
  } = useCamera({ enableAudio: true });
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get current device orientation
  const orientation = orientationUtils.useOrientation();
  
  // Start timer for recording duration
  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      setRecordingTime(0);
    }
    
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [isRecording]);
  
  // Format recording time as MM:SS
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Handle taking a photo
  const handleTakePhoto = useCallback(async () => {
    const photo = await takePhoto();
    if (photo && onCapture) {
      onCapture(photo.uri, 'photo');
    }
  }, [takePhoto, onCapture]);
  
  // Handle starting/stopping video recording
  const handleRecording = useCallback(async () => {
    if (isRecording) {
      const video = await stopRecording();
      setIsRecording(false);
      if (video && onCapture) {
        onCapture(video.uri, 'video');
      }
    } else {
      setIsRecording(true);
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording, onCapture]);
  
  // Handle tap to focus
  const handleFocus = useCallback((event) => {
    const { locationX, locationY } = event.nativeEvent;
    const { width, height } = Dimensions.get('window');
    
    // Convert to normalized coordinates (0-1)
    const x = locationX / width;
    const y = locationY / height;
    
    focus(x, y);
  }, [focus]);
  
  // Request permissions if not granted
  const requestPermissions = useCallback(async () => {
    if (cameraState.hasCameraPermission === false) {
      const granted = await permissionUtils.requestCameraPermission();
      if (!granted) {
        permissionUtils.showPermissionExplanation('camera', requestPermissions);
      }
    }
    
    if (cameraState.hasStoragePermission === false) {
      const granted = await permissionUtils.requestStoragePermission();
      if (!granted) {
        permissionUtils.showPermissionExplanation('storage', requestPermissions);
      }
    }
  }, [cameraState]);
  
  // If permissions are not granted
  if (!cameraState.hasCameraPermission || !cameraState.hasStoragePermission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Camera and storage permissions are required to capture media.
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermissions}>
          <Text style={styles.permissionButtonText}>Grant Permissions</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {/* Camera */}
      {activeDevice && cameraState.isActive && (
        <TouchableOpacity
          activeOpacity={1}
          style={StyleSheet.absoluteFill}
          onPress={handleFocus}
        >
          <Camera
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            device={activeDevice}
            isActive={cameraState.isActive && !isRecording}
            photo={true}
            video={true}
            audio={true}
            orientation={orientation === 'portrait' ? 'portrait' : 'landscapeLeft'}
            enableZoomGesture
          />
        </TouchableOpacity>
      )}
      
      {/* Recording timer */}
      {isRecording && (
        <View style={styles.recordingIndicator}>
          <View style={styles.recordingDot} />
          <Text style={styles.recordingTime}>{formatTime(recordingTime)}</Text>
        </View>
      )}
      
      {/* Camera controls */}
      <View style={styles.controls}>
        {/* Close button */}
        {onClose && (
          <CaptureButton
            icon="close"
            onPress={onClose}
            style={styles.closeButton}
          />
        )}
        
        {/* Flash toggle button */}
        <CaptureButton
          icon="flash"
          onPress={toggleFlash}
          isActive={cameraState.flashMode === 'on'}
          style={styles.controlButton}
        />
        
        {/* Main capture button */}
        <CaptureButton
          onPress={handleTakePhoto}
          onLongPress={handleRecording}
          isRecording={isRecording}
          size={80}
        />
        
        {/* Camera switch button */}
        <CaptureButton
          icon="camera-reverse-outline"
          onPress={switchCamera}
          style={styles.controlButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#000',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingIndicator: {
    position: 'absolute',
    top: 40,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'red',
    marginRight: 8,
  },
  recordingTime: {
    color: '#fff',
    fontSize: 14,
  },
});

export default CameraView;
