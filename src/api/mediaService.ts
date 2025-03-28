import { api } from './apiClient';
import { SignedUrlResponse, MediaFile } from '../types';
import RNFS from 'react-native-fs';
import RNBackgroundUpload, { UploadOptions } from 'react-native-background-upload';

/**
 * Media Service - Handles all media related operations
 */
export const mediaService = {
  /**
   * Get a signed URL for media upload
   * @returns Signed URL and ID
   */
  getSignedUrl: async (): Promise<SignedUrlResponse> => {
    try {
      // Based on the API specification, the endpoint for signed URL is '/media/signed-url'
      const response = await api.get<SignedUrlResponse>('/media/signed-url', {
        'bucket-prefix': 'posts'
      });
      return response;
    } catch (error) {
      console.error('Error getting signed URL:', error);
      throw error;
    }
  },

  /**
   * Upload media file to the server
   * @param mediaFile - Media file to upload
   * @param onProgress - Progress callback
   * @returns Upload result including the URL
   */
  uploadMedia: async (
    mediaFile: MediaFile, 
    onProgress?: (progress: number) => void
  ): Promise<string> => {
    try {
      // Get signed URL for upload
      const signedUrlResponse = await mediaService.getSignedUrl();
      
      // Prepare upload options with proper types from UploadOptions
      const options: UploadOptions = {
        url: signedUrlResponse.s3url,
        path: mediaFile.uri,
        method: 'PUT', // Type-safe method
        type: 'raw',   // Using 'raw' type, not 'multipart' which would require 'field'
        headers: {
          'Content-Type': mediaFile.type === 'photo' ? 'image/jpeg' : 'video/mp4',
        },
      };

      // Start the upload
      return new Promise((resolve, reject) => {
        // Include notification options in the original options object
        const uploadOptions: UploadOptions = {
          ...options,
          notification: {
            enabled: true,
            autoClear: true,
            onProgressTitle: 'Uploading Media',
            onProgressMessage: 'Your media is being uploaded',
            onCompleteTitle: 'Upload Complete',
            onCompleteMessage: 'Your media has been uploaded successfully',
            onErrorTitle: 'Upload Failed',
            onErrorMessage: 'There was an error uploading your media'
          }
        };
        
        RNBackgroundUpload.startUpload(uploadOptions).then((uploadId) => {
          console.log(`Upload started with ID: ${uploadId}`);
          
          // Register for upload events
          RNBackgroundUpload.addListener('progress', uploadId, (data) => {
            if (onProgress) {
              onProgress(data.progress / 100);
            }
          });
          
          RNBackgroundUpload.addListener('error', uploadId, (data) => {
            reject(new Error(`Upload error: ${data.error}`));
          });
          
          RNBackgroundUpload.addListener('completed', uploadId, (data) => {
            resolve(signedUrlResponse.s3url);
          });
        }).catch(error => {
          reject(error);
        });
      });
    } catch (error) {
      console.error('Error uploading media:', error);
      throw error;
    }
  },

  /**
   * Save captured media to local storage
   * @param uri - URI of the captured media
   * @param type - Type of media (photo or video)
   * @returns Media file object
   */
  saveMediaToLocalStorage: async (uri: string, type: 'photo' | 'video'): Promise<MediaFile> => {
    try {
      // Create directory if it doesn't exist
      const dirPath = `${RNFS.DocumentDirectoryPath}/qrscanner`;
      const dirExists = await RNFS.exists(dirPath);
      
      if (!dirExists) {
        await RNFS.mkdir(dirPath);
      }
      
      // Generate unique filename
      const timestamp = new Date().getTime();
      const extension = type === 'photo' ? 'jpg' : 'mp4';
      const fileName = `${timestamp}.${extension}`;
      const destPath = `${dirPath}/${fileName}`;
      
      // Copy file to local storage
      await RNFS.copyFile(uri, destPath);
      
      // Get file stats
      const stats = await RNFS.stat(destPath);
      
      return {
        uri: destPath,
        type,
        name: fileName,
        size: stats.size
      };
    } catch (error) {
      console.error('Error saving media to local storage:', error);
      throw error;
    }
  },

  /**
   * Delete media file from local storage
   * @param uri - URI of the media file
   */
  deleteMedia: async (uri: string): Promise<void> => {
    try {
      if (await RNFS.exists(uri)) {
        await RNFS.unlink(uri);
      }
    } catch (error) {
      console.error('Error deleting media:', error);
      throw error;
    }
  }
};
