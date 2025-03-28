import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, Text, Vibration, ActivityIndicator } from 'react-native';
import { Camera } from 'react-native-vision-camera';
import { useCamera } from '../hooks/useCamera';
import { useQRScanner } from '../hooks/useQRScanner';
import { QRCodeDetails } from '../types';
import RiveAnimation from './RiveAnimation';
import CaptureButton from './CaptureButton';
import { orientationUtils } from '../utils/orientation';

interface QRScannerProps {
  onQRCodeScanned?: (qrCode: string) => void;
  onQRDetailsReceived?: (details: QRCodeDetails) => void;
  onCapture?: (uri: string, type: 'photo' | 'video') => void;
}

const QRScanner: React.FC<QRScannerProps> = ({
  onQRCodeScanned,
  onQRDetailsReceived,
  onCapture
}) => {
  // Get current device orientation
  const orientation = orientationUtils.useOrientation();
  
  // Setup camera hooks
  const {
    cameraRef,
    cameraState,
    activeDevice,
    takePhoto,
    startRecording,
    stopRecording,
    toggleFlash,
    switchCamera
  } = useCamera({ enableAudio: true });
  
  // Setup QR scanner hooks
  const {
    isScanning,
    scannedCode,
    qrDetails,
    isLoading,
    error,
    frameProcessor,
    resetScanner
  } = useQRScanner({
    onQRScanned: (qrData) => {
      // Vibrate on successful scan
      Vibration.vibrate(200);
      
      if (onQRCodeScanned) {
        onQRCodeScanned(qrData);
      }
    },
    onQRDetailsReceived
  });
  
  // Track recording state
  const [isRecording, setIsRecording] = useState(false);
  
  // Animation URL based on device orientation
  const [animationUrl, setAnimationUrl] = useState<string | null>(null);
  
  // Update animation URL when QR details or orientation changes
  useEffect(() => {
    if (qrDetails) {
      // Select the appropriate animation URL based on orientation
      const url = orientation === 'portrait' ? qrDetails.port_riv : qrDetails.land_riv;
      setAnimationUrl(url);
    } else {
      setAnimationUrl(null);
    }
  }, [qrDetails, orientation]);
  
  // Handle photo capture
  const handleTakePhoto = useCallback(async () => {
    const photo = await takePhoto();
    if (photo && onCapture) {
      onCapture(photo.uri, 'photo');
    }
  }, [takePhoto, onCapture]);
  
  // Handle video recording start/stop
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
  
  // If camera permissions are not granted
  if (cameraState.hasCameraPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Camera permission is required to scan QR codes and capture media.
        </Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {/* Camera */}
      {activeDevice && cameraState.isActive && (
        <Camera
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          device={activeDevice}
          isActive={cameraState.isActive}
          frameProcessor={frameProcessor}
          frameProcessorFps={5}
          photo={true}
          video={true}
          audio={true}
          enableZoomGesture
        />
      )}
      
      {/* Loading indicator */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Loading QR data...</Text>
        </View>
      )}
      
      {/* QR code scanner overlay */}
      {isScanning && !scannedCode && (
        <View style={styles.scannerOverlay}>
          <View style={styles.scannerTarget} />
          <Text style={styles.scannerText}>Position QR code in the center</Text>
        </View>
      )}
      
      {/* Rive animation overlay */}
      {animationUrl && (
        <RiveAnimation 
          url={animationUrl} 
          style={styles.animation} 
          orientation={orientation}
        />
      )}
      
      {/* Error message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      {/* Camera controls */}
      <View style={styles.controls}>
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
      
      {/* QR Data preview (when scanned) */}
      {qrDetails && (
        <View style={styles.qrInfoOverlay}>
          <Text style={styles.qrInfoTitle}>{qrDetails.subject}</Text>
          <Text style={styles.qrInfoContext}>{qrDetails.context}</Text>
          <CaptureButton
            label="Scan Again"
            onPress={resetScanner}
            style={styles.scanAgainButton}
          />
        </View>
      )}
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
  },
  scannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerTarget: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
  },
  scannerText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 8,
    borderRadius: 4,
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
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 12,
  },
  errorContainer: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 50, 50, 0.8)',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  errorText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  animation: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  qrInfoOverlay: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  qrInfoTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  qrInfoContext: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
  },
  scanAgainButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
});

export default QRScanner;
