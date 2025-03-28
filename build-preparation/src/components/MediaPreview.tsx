import React, { useCallback, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Video from 'react-native-video';
import { MediaFile } from '../types';
import CaptureButton from './CaptureButton';

interface MediaPreviewProps {
  mediaFiles: MediaFile[];
  selectedMedia?: MediaFile | null;
  onSelect?: (media: MediaFile) => void;
  onDelete?: (uri: string) => void;
  onShare?: (media: MediaFile) => void;
  isUploading?: boolean;
  uploadProgress?: number;
}

const { width: screenWidth } = Dimensions.get('window');

const MediaPreview: React.FC<MediaPreviewProps> = ({
  mediaFiles,
  selectedMedia,
  onSelect,
  onDelete,
  onShare,
  isUploading = false,
  uploadProgress = 0,
}) => {
  // Filter and sort media by creation date (newest first)
  const sortedMedia = useMemo(() => {
    return [...mediaFiles].sort((a, b) => {
      // Extract timestamp from filename (assuming format timestamp.ext)
      const timestampA = parseInt(a.name.split('.')[0], 10) || 0;
      const timestampB = parseInt(b.name.split('.')[0], 10) || 0;
      return timestampB - timestampA;
    });
  }, [mediaFiles]);
  
  // Format file size for display
  const formatFileSize = useCallback((bytes?: number): string => {
    if (!bytes) return '';
    
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }, []);
  
  // If no media files
  if (mediaFiles.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No media captured yet</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {/* Main preview area */}
      <View style={styles.previewContainer}>
        {selectedMedia ? (
          selectedMedia.type === 'photo' ? (
            // Photo preview
            <Image
              source={{ uri: selectedMedia.uri }}
              style={styles.previewImage}
              resizeMode="contain"
            />
          ) : (
            // Video preview
            <Video
              source={{ uri: selectedMedia.uri }}
              style={styles.previewVideo}
              resizeMode="contain"
              controls={true}
              repeat={true}
              paused={false}
            />
          )
        ) : (
          // No selection placeholder
          <View style={styles.noSelectionContainer}>
            <Text style={styles.noSelectionText}>Select media to preview</Text>
          </View>
        )}
        
        {/* Upload progress overlay */}
        {isUploading && selectedMedia && (
          <View style={styles.uploadOverlay}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.uploadText}>
              Uploading... {Math.round(uploadProgress * 100)}%
            </Text>
          </View>
        )}
      </View>
      
      {/* Media info and actions */}
      {selectedMedia && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            {selectedMedia.type === 'photo' ? 'Photo' : 'Video'} • {formatFileSize(selectedMedia.size)}
          </Text>
          
          <View style={styles.actionButtons}>
            {/* Delete button */}
            <CaptureButton
              icon="trash-2"
              onPress={() => onDelete && onDelete(selectedMedia.uri)}
              style={styles.actionButton}
            />
            
            {/* Share button */}
            <CaptureButton
              icon="share"
              onPress={() => onShare && onShare(selectedMedia)}
              style={styles.actionButton}
            />
          </View>
        </View>
      )}
      
      {/* Thumbnail gallery */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.thumbnailScroll}
        contentContainerStyle={styles.thumbnailContainer}
      >
        {sortedMedia.map((media) => (
          <TouchableOpacity
            key={media.uri}
            style={[
              styles.thumbnailButton,
              selectedMedia?.uri === media.uri && styles.selectedThumbnail,
            ]}
            onPress={() => onSelect && onSelect(media)}
          >
            <Image
              source={{ uri: media.uri }}
              style={styles.thumbnail}
            />
            {media.type === 'video' && (
              <View style={styles.videoIndicator}>
                <Feather name="video" size={12} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
  previewContainer: {
    height: 300,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewVideo: {
    width: '100%',
    height: '100%',
  },
  noSelectionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noSelectionText: {
    color: '#fff',
    fontSize: 16,
  },
  thumbnailScroll: {
    maxHeight: 100,
  },
  thumbnailContainer: {
    padding: 10,
  },
  thumbnailButton: {
    width: 80,
    height: 80,
    marginRight: 8,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedThumbnail: {
    borderColor: '#2196F3',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  videoIndicator: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 4,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 14,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoText: {
    fontSize: 14,
    color: '#555',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
});

export default MediaPreview;
