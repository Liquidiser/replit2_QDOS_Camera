import { useCallback, useEffect, useState } from 'react';
import { MediaFile } from '../types';
import { mediaService } from '../api/mediaService';
import { fileStorage } from '../utils/fileStorage';

interface UseMediaCaptureOptions {
  autoUpload?: boolean;
  onUploadProgress?: (progress: number) => void;
  onUploadComplete?: (url: string) => void;
  onUploadError?: (error: Error) => void;
}

/**
 * Custom hook for media capture functionality
 * @param options - Media capture configuration options
 * @returns Media capture state and controls
 */
export const useMediaCapture = (options: UseMediaCaptureOptions = {}) => {
  const [capturedMedia, setCapturedMedia] = useState<MediaFile[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaFile | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load saved media on mount
  useEffect(() => {
    const loadSavedMedia = async () => {
      try {
        const media = await fileStorage.getAllMedia();
        setCapturedMedia(media);
      } catch (err) {
        console.error('Error loading saved media:', err);
      }
    };

    loadSavedMedia();
  }, []);

  // Save captured photo
  const savePhoto = useCallback(async (photoUri: string): Promise<MediaFile | null> => {
    try {
      setError(null);
      
      // Save to local storage
      const savedMedia = await fileStorage.saveMedia(photoUri, 'photo');
      
      // Update state
      setCapturedMedia(prev => [...prev, savedMedia]);
      setSelectedMedia(savedMedia);
      
      // Auto upload if enabled
      if (options.autoUpload) {
        uploadMedia(savedMedia);
      }
      
      return savedMedia;
    } catch (err) {
      setError('Failed to save photo');
      console.error('Error saving photo:', err);
      return null;
    }
  }, [options.autoUpload]);

  // Save captured video
  const saveVideo = useCallback(async (videoUri: string): Promise<MediaFile | null> => {
    try {
      setError(null);
      
      // Save to local storage
      const savedMedia = await fileStorage.saveMedia(videoUri, 'video');
      
      // Update state
      setCapturedMedia(prev => [...prev, savedMedia]);
      setSelectedMedia(savedMedia);
      
      // Auto upload if enabled
      if (options.autoUpload) {
        uploadMedia(savedMedia);
      }
      
      return savedMedia;
    } catch (err) {
      setError('Failed to save video');
      console.error('Error saving video:', err);
      return null;
    }
  }, [options.autoUpload]);

  // Upload media to server
  const uploadMedia = useCallback(async (media: MediaFile): Promise<string | null> => {
    try {
      setError(null);
      setIsUploading(true);
      setUploadProgress(0);
      
      // Progress callback
      const handleProgress = (progress: number) => {
        setUploadProgress(progress);
        if (options.onUploadProgress) {
          options.onUploadProgress(progress);
        }
      };
      
      // Upload media
      const url = await mediaService.uploadMedia(media, handleProgress);
      
      // Update state
      setUploadedUrl(url);
      setIsUploading(false);
      setUploadProgress(1);
      
      // Callback
      if (options.onUploadComplete) {
        options.onUploadComplete(url);
      }
      
      return url;
    } catch (err) {
      setError('Failed to upload media');
      setIsUploading(false);
      console.error('Error uploading media:', err);
      
      // Callback
      if (options.onUploadError && err instanceof Error) {
        options.onUploadError(err);
      }
      
      return null;
    }
  }, [options]);

  // Delete media
  const deleteMedia = useCallback(async (mediaUri: string): Promise<boolean> => {
    try {
      setError(null);
      
      // Delete from storage
      await fileStorage.deleteMedia(mediaUri);
      
      // Update state
      setCapturedMedia(prev => prev.filter(m => m.uri !== mediaUri));
      
      if (selectedMedia?.uri === mediaUri) {
        setSelectedMedia(null);
      }
      
      return true;
    } catch (err) {
      setError('Failed to delete media');
      console.error('Error deleting media:', err);
      return false;
    }
  }, [selectedMedia]);

  // Select media from the list
  const selectMedia = useCallback((media: MediaFile) => {
    setSelectedMedia(media);
  }, []);

  // Clear all captured media
  const clearAllMedia = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);
      
      // Clear storage
      await fileStorage.clearAllMedia();
      
      // Reset state
      setCapturedMedia([]);
      setSelectedMedia(null);
      
      return true;
    } catch (err) {
      setError('Failed to clear media');
      console.error('Error clearing media:', err);
      return false;
    }
  }, []);

  return {
    capturedMedia,
    selectedMedia,
    uploadProgress,
    isUploading,
    uploadedUrl,
    error,
    savePhoto,
    saveVideo,
    uploadMedia,
    deleteMedia,
    selectMedia,
    clearAllMedia
  };
};
