import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, StatusBar, BackHandler, Alert } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import QRScanner from '../components/QRScanner';
import CameraView from '../components/CameraView';
import MediaPreview from '../components/MediaPreview';
import { QRCodeDetails, MediaFile } from '../types';
import { useMediaCapture } from '../hooks/useMediaCapture';
import { qrService } from '../api/qrService';
import ShareButton from '../components/ShareButton';
import ErrorDisplay from '../components/ErrorDisplay';
import { orientationUtils } from '../utils/orientation';

const ScanScreen: React.FC = () => {
  const navigation = useNavigation();
  const orientation = orientationUtils.useOrientation();
  
  // State management
  const [scanMode, setScanMode] = useState<'qr' | 'media'>('qr');
  const [qrCode, setQRCode] = useState<string | null>(null);
  const [qrDetails, setQRDetails] = useState<QRCodeDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Media capture hook
  const {
    capturedMedia,
    selectedMedia,
    uploadProgress,
    isUploading,
    uploadedUrl,
    savePhoto,
    saveVideo,
    uploadMedia,
    deleteMedia,
    selectMedia
  } = useMediaCapture({
    onUploadProgress: (progress) => {
      console.log(`Upload progress: ${progress * 100}%`);
    },
    onUploadComplete: (url) => {
      Alert.alert('Success', 'Media uploaded successfully');
    },
    onUploadError: (error) => {
      setError(`Upload failed: ${error.message}`);
    }
  });
  
  // Handle back button press
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (scanMode === 'media') {
          setScanMode('qr');
          return true;
        }
        return false;
      };
      
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [scanMode])
  );
  
  // Handle QR code scan
  const handleQRCodeScanned = (code: string) => {
    setQRCode(code);
    setError(null);
  };
  
  // Handle QR details received
  const handleQRDetailsReceived = (details: QRCodeDetails) => {
    setQRDetails(details);
  };
  
  // Handle media capture
  const handleCapture = async (uri: string, type: 'photo' | 'video') => {
    setError(null);
    
    try {
      if (type === 'photo') {
        await savePhoto(uri);
      } else {
        await saveVideo(uri);
      }
      
      // Switch to media preview mode
      setScanMode('media');
    } catch (err) {
      setError('Failed to save captured media');
    }
  };
  
  // Handle media upload
  const handleUploadMedia = async () => {
    if (!selectedMedia || !qrCode) {
      setError('No media selected or no QR code scanned');
      return;
    }
    
    try {
      // First upload the media file
      const mediaUrl = await uploadMedia(selectedMedia);
      
      if (!mediaUrl) {
        setError('Failed to upload media');
        return;
      }
      
      // Then create a QR post with the uploaded media
      if (qrDetails) {
        const postData = {
          qr_code: qrCode,
          subject: qrDetails.subject,
          context: qrDetails.context,
          narrative: qrDetails.narrative,
          image_url: mediaUrl
        };
        
        await qrService.createQRPost(postData);
        
        Alert.alert(
          'Success',
          'Media uploaded and QR post created successfully',
          [
            { 
              text: 'OK', 
              onPress: () => navigation.navigate('Share', { qrId: qrDetails.qr_id }) 
            }
          ]
        );
      }
    } catch (err) {
      setError('Failed to create QR post');
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Error display */}
      {error && (
        <ErrorDisplay 
          message={error} 
          onDismiss={() => setError(null)} 
          style={styles.errorDisplay}
        />
      )}
      
      {/* Main content based on current mode */}
      {scanMode === 'qr' ? (
        // QR Scanner mode
        <QRScanner
          onQRCodeScanned={handleQRCodeScanned}
          onQRDetailsReceived={handleQRDetailsReceived}
          onCapture={handleCapture}
        />
      ) : (
        // Media preview mode
        <View style={styles.mediaContainer}>
          <MediaPreview
            mediaFiles={capturedMedia}
            selectedMedia={selectedMedia}
            onSelect={selectMedia}
            onDelete={deleteMedia}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
          />
          
          {/* Action buttons */}
          <View style={styles.actionButtons}>
            <ShareButton
              label="Back to Scanner"
              onPress={() => setScanMode('qr')}
              type="secondary"
              iconPosition="left"
              icon="arrow-left"
            />
            
            <ShareButton
              label="Upload Media"
              onPress={handleUploadMedia}
              isLoading={isUploading}
              disabled={!selectedMedia || isUploading}
              icon="upload-cloud"
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  mediaContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  errorDisplay: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    zIndex: 100,
  },
});

export default ScanScreen;
