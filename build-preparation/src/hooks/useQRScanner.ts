import { useCallback, useState } from 'react';
import { useSharedValue, runOnJS } from 'react-native-reanimated';
import type { Camera } from 'react-native-vision-camera';
import { qrService } from '../api/qrService';
import { QRCodeDetails } from '../types';

// Define Frame interface for vision-camera
interface FrameType {
  width: number;
  height: number;
  bytesPerRow: number;
  detectBarcodes: () => Array<{
    value: string;
    format?: string;
    type?: string;
    bounds?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }>;
}

interface UseQRScannerOptions {
  onQRScanned?: (qrData: string) => void;
  onQRDetailsReceived?: (details: QRCodeDetails) => void;
  enableBarcodes?: boolean;
}

/**
 * Custom hook for QR code scanning functionality
 * @param options - QR scanner configuration options
 * @returns QR scanner state and controls
 */
export const useQRScanner = (options: UseQRScannerOptions = {}) => {
  const [isScanning, setIsScanning] = useState(true);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [qrDetails, setQRDetails] = useState<QRCodeDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use shared value for smooth animations
  const hasScanned = useSharedValue(false);

  // Process QR data after scanning
  const processQRData = useCallback(async (qrData: string) => {
    if (!isScanning || hasScanned.value) return;
    
    // Extract QR ID from QR data (assuming format like https://qdos.bz/123456)
    const qrId = qrData.split('/').pop() || qrData;
    
    // Mark as scanned to prevent duplicate scans
    hasScanned.value = true;
    setIsScanning(false);
    setScannedCode(qrData);
    
    // Optional callback
    if (options.onQRScanned) {
      options.onQRScanned(qrData);
    }
    
    // Fetch QR details from API
    try {
      setIsLoading(true);
      setError(null);
      
      const details = await qrService.getQRDetails(qrId);
      setQRDetails(details);
      
      // Optional callback
      if (options.onQRDetailsReceived) {
        options.onQRDetailsReceived(details);
      }
    } catch (err) {
      setError('Failed to retrieve QR code details');
      console.error('Error fetching QR details:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isScanning, hasScanned, options]);

  // Frame processor for QR code detection
  // Using any type here due to limitations with VisionCamera types in worklets
  // TODO: Replace with proper type when VisionCamera types are updated
  const frameProcessor = useCallback((frame: any) => {
    'worklet';
    
    // Skip processing if not scanning
    if (!isScanning || hasScanned.value) return;
    
    // Detect QR codes in the frame
    const qrCodes = frame.detectBarcodes();
    
    // Process the first detected QR code
    if (qrCodes.length > 0) {
      const qrCode = qrCodes[0];
      
      // In worklets we can't directly call async functions
      // So we use runOnJS to call our process function on the JS thread
      runOnJS(processQRData)(qrCode.value);
    }
  }, [isScanning, hasScanned, processQRData]);

  // Reset scanner state to scan again
  const resetScanner = useCallback(() => {
    hasScanned.value = false;
    setIsScanning(true);
    setScannedCode(null);
    setQRDetails(null);
    setError(null);
  }, [hasScanned]);

  // Manually set a QR code (for testing or manual input)
  const setManualQRCode = useCallback(async (qrData: string) => {
    await processQRData(qrData);
  }, [processQRData]);

  return {
    isScanning,
    scannedCode,
    qrDetails,
    isLoading,
    error,
    frameProcessor,
    resetScanner,
    setManualQRCode
  };
};
