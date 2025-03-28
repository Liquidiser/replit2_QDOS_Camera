import React, { useCallback, useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  Alert, 
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import MediaPreview from '../components/MediaPreview';
import ShareButton from '../components/ShareButton';
import ErrorDisplay from '../components/ErrorDisplay';
import { useMediaCapture } from '../hooks/useMediaCapture';
import CameraView from '../components/CameraView';
import { mediaService } from '../api/mediaService';

const MediaScreen: React.FC = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  
  // State management
  const [isCapturing, setIsCapturing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
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
    selectMedia,
    clearAllMedia
  } = useMediaCapture();
  
  // Refresh media list
  const refreshMediaList = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);
    
    try {
      // In a real application, you might refetch media from storage here
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      setError('Failed to refresh media list');
    } finally {
      setIsRefreshing(false);
    }
  }, []);
  
  // Refresh when screen is focused
  useEffect(() => {
    if (isFocused) {
      refreshMediaList();
    }
  }, [isFocused, refreshMediaList]);
  
  // Handle media capture
  const handleCapture = async (uri: string, type: 'photo' | 'video') => {
    setError(null);
    
    try {
      if (type === 'photo') {
        await savePhoto(uri);
      } else {
        await saveVideo(uri);
      }
      
      // Exit capture mode
      setIsCapturing(false);
    } catch (err) {
      setError('Failed to save captured media');
    }
  };
  
  // Handle media upload
  const handleUploadMedia = async () => {
    if (!selectedMedia) {
      setError('No media selected');
      return;
    }
    
    try {
      const mediaUrl = await uploadMedia(selectedMedia);
      
      if (mediaUrl) {
        Alert.alert('Success', 'Media uploaded successfully');
      }
    } catch (err) {
      setError('Failed to upload media');
    }
  };
  
  // Confirm and clear all media
  const handleClearAll = () => {
    Alert.alert(
      'Clear All Media',
      'Are you sure you want to delete all captured media? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllMedia();
            } catch (err) {
              setError('Failed to clear media');
            }
          }
        }
      ]
    );
  };
  
  // Share media to Twitter
  const handleShareMedia = async (media: any) => {
    if (!media) return;
    
    // First, upload the media if not already uploaded
    if (!uploadedUrl) {
      try {
        await uploadMedia(media);
        // Navigate to share screen with media info
        navigation.navigate('Share', { mediaUrl: uploadedUrl });
      } catch (err) {
        setError('Failed to upload media for sharing');
      }
    } else {
      // Navigate to share screen with media info
      navigation.navigate('Share', { mediaUrl: uploadedUrl });
    }
  };
  
  // Show camera for new capture
  if (isCapturing) {
    return (
      <CameraView
        onCapture={handleCapture}
        onClose={() => setIsCapturing(false)}
      />
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Media Gallery</Text>
      </View>
      
      {/* Error display */}
      {error && (
        <ErrorDisplay 
          message={error} 
          onDismiss={() => setError(null)} 
        />
      )}
      
      {/* Media content */}
      {isRefreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Loading media...</Text>
        </View>
      ) : (
        <View style={styles.mediaContainer}>
          <MediaPreview
            mediaFiles={capturedMedia}
            selectedMedia={selectedMedia}
            onSelect={selectMedia}
            onDelete={deleteMedia}
            onShare={handleShareMedia}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
          />
        </View>
      )}
      
      {/* Action buttons */}
      <View style={styles.actionButtons}>
        <View style={styles.buttonGroup}>
          <ShareButton
            label="New Capture"
            onPress={() => setIsCapturing(true)}
            icon="camera"
            type="secondary"
          />
          
          <ShareButton
            label="Clear All"
            onPress={handleClearAll}
            icon="trash-2"
            type="secondary"
            disabled={capturedMedia.length === 0}
          />
        </View>
        
        <ShareButton
          label="Upload Selected"
          onPress={handleUploadMedia}
          isLoading={isUploading}
          disabled={!selectedMedia || isUploading}
          icon="upload-cloud"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  mediaContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  actionButtons: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
});

export default MediaScreen;
